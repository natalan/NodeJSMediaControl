/**
 *	Morning Routine
 *
 *	Author: Andrei Zharov
 *	Date: 2014-5-21
 */
definition(
    name: "Turn On TV by Zwave Remote",
    namespace: "belmass@gmail.com",
    author: "Andrei Zharov",
    description: "Routine to turn on tv, receiver, and switch to dvr hdmi input",
    category: "Convenience",
    iconUrl: "https://s3.amazonaws.com/smartapp-icons/MyApps/Cat-MyApps.png",
    iconX2Url: "https://s3.amazonaws.com/smartapp-icons/MyApps/Cat-MyApps@2x.png"
)

preferences {
	page(name: "selectButton")
	page(name: "configureButton")
}

def selectButton() {
	dynamicPage(name: "selectButton", title: "Select your button device, tv, and receiver", nextPage: "configureButton", uninstall: configured()) {
		section {
			input "buttonDevice", "capability.button", title: "Button", multiple: false, required: true
			input "tv", "capability.switch", title: "TV", multiple: false, required: true
			input "receiver", "capability.switch", title: "Receiver", multiple: false, required: true
		}
		
		section(title: "More options", hidden: hideOptionsSection(), hideable: true) {
			
			def timeLabel = timeIntervalLabel()

			href "timeIntervalInput", title: "Only during a certain time", description: timeLabel ?: "Tap to set", state: timeLabel ? "complete" : null

			input "days", "enum", title: "Only on certain days of the week", multiple: true, required: false,
				options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

			input "modes", "mode", title: "Only when mode is", multiple: true, required: false
		}
	}
}

def configureButton() {
	dynamicPage(name: "configureButton", title: "Pick Remote Button and action type", install: true, uninstall: configured(), {
		section("Pick Button") {
			input "buttonNumber", "enum", title: "Pick button", required: true,
		  		metadata: [ 
			        values: ["1", "2", "3", "4" ]
				]
			input "actionType", "enum", title: "Pick action type", required: true, metadata: [ values: [ 'pushed', 'held' ] ]
		}
	})
}

def installed() {
	initialize()
}

def updated() {
	unsubscribe()
	initialize()
}

def initialize() {
	subscribe(buttonDevice, "button", buttonEvent)
}

def configured() {
	return buttonDevice || buttonConfigured()
}

def buttonConfigured() {
	return settings["buttonNumber"] && settings["actionType"]
}

def buttonEvent(evt){
	if(allOk) {
		def buttonNumber = evt.data // why doesn't jsonData work? always returning [:]
		def value = evt.value
		log.debug "buttonEvent: $evt.name = $evt.value ($evt.data)"
		log.debug "button: $buttonNumber, value: $value"
	
		def recentEvents = buttonDevice.eventsSince(new Date(now() - 3000)).findAll{it.value == evt.value && it.data == evt.data}
		log.debug "Found ${recentEvents.size()?:0} events in past 3 seconds"
	
		if(recentEvents.size <= 1){
			def button = settings["buttonNumber"]
			def action = settings["actionType"]
			if (buttonNumber == button && value == action) {
				executeHandlers()
			} else {
				log.debug "Pressed some other button. Not $button. Or action wasn't $action"
			}
		} else {
			log.debug "Found recent button press events for $buttonNumber with value $value"
		}
	}
}

def executeHandlers() {
	log.debug "executeHandlers: $buttonNumber - $value"
	settings["tv"].on();
	settings["receiver"].on();
	runIn(5, "switchReceiverToDVR")
	
}

def switchReceiverToDVR() {
	settings["receiver"].dvr();
}

// execution filter methods
private getAllOk() {
	modeOk && daysOk && timeOk
}

private getModeOk() {
	def result = !modes || modes.contains(location.mode)
	log.trace "modeOk = $result"
	result
}

private getDaysOk() {
	def result = true
	if (days) {
		def df = new java.text.SimpleDateFormat("EEEE")
		if (location.timeZone) {
			df.setTimeZone(location.timeZone)
		}
		else {
			df.setTimeZone(TimeZone.getTimeZone("America/New_York"))
		}
		def day = df.format(new Date())
		result = days.contains(day)
	}
	log.trace "daysOk = $result"
	result
}

private getTimeOk() {
	def result = true
	if (starting && ending) {
		def currTime = now()
		def start = timeToday(starting).time
		def stop = timeToday(ending).time
		result = start < stop ? currTime >= start && currTime <= stop : currTime <= stop || currTime >= start
	}
	log.trace "timeOk = $result"
	result
}

private hhmm(time, fmt = "h:mm a")
{
	def t = timeToday(time, location.timeZone)
	def f = new java.text.SimpleDateFormat(fmt)
	f.setTimeZone(location.timeZone ?: timeZone(time))
	f.format(t)
}

private hideOptionsSection() {
	(starting || ending || days || modes) ? false : true
}

private timeIntervalLabel() {
	(starting && ending) ? hhmm(starting) + "-" + hhmm(ending, "h:mm a z") : ""
}