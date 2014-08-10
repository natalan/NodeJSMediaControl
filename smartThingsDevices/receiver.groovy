/**
 *  Smartthings integration with Pioneer VSX 821K
 *  author: Andrei Zharov 
 *  Date: 08/06/14
 *
 *  See my other projects to integrate this with node server
* 
 */
preferences {
  input("server", "text",  title: "server", description: "node.js server url")
  input("username", "text", title: "username", description: "node.js server username")
  input("password", "password", title: "password", description: "node.js server password")
}

metadata {
  definition (name: "Pioneer VSX 821K", namespace: "belmass@gmail.com", author: "Andrei Zharov", description: "Smartthings integration with Pioneer VSX 821K", category: "Convenience") {
    capability "Switch"
    capability "Polling"

    command "dvd"
    command "dvr"
  }

  tiles {
    standardTile("switch", "device.switch", width: 2, height: 2) {
      state "off", label: '${name}', action: "switch.on", icon: "st.Electronics.electronics19", backgroundColor: "#ffffff"
      state "on", label: '${name}', action: "switch.off", icon: "st.Electronics.electronics19", backgroundColor: "#79b821"
    }

    standardTile("inputDVD", "device.image", width: 1, height: 1) {
      state "on", label: "DVD", action: "dvd", icon: "", backgroundColor: "#79b821"
      state "off", label: "DVD", action: "dvd", icon: "", backgroundColor: "#ffffff"
    }

    standardTile("inputDVR", "device.image", width: 1, height: 1) {
      state "on", label: "DVR", action: "dvd", icon: "", backgroundColor: "#79b821"
      state "off", label: "DVR", action: "dvd", icon: "", backgroundColor: "#ffffff"
    }

    main "switch"
    details (["switch", "inputDVD", "inputDVR"])
  }
}

def api(method, body, success = {}) {
  def userpassascii="${username}:${password}"
  def userPass = "Basic " + userpassascii.encodeAsBase64().toString()

  def methods = [
    "status": [
      uri: "https://${server}",
      path: "/api/tv/status",
      type: "get", 
      headers: [Authorization: "$userPass"]
    ],
    "command": [
      uri: "https://${server}",
      path: "/api/blaster/send",
      type: "post", 
      headers: [Authorization: "$userPass"],
      body: body
    ]
  ]

  def request = methods.getAt(method)

  doRequest(request, success)
}

private doRequest(params, success) {
  log.debug "doRequest :: Sending $params.type request to $params.uri/$params.path"
  if (params.type == "get") {
    httpGet(params, success)
  } else if (params.type == "post") {
    httpPostJson(params, success)
  }
}

def parse(String description) {

}

def on() {
  api("command", '{ "command" : "receiver.powerOn" }') { response ->
    log.debug "on :: Response: $response.data.message"
    if (response.data.message == "ok") {
      sendEvent(name: "switch", value: "on")
    } else {
      log.debug "on :: Message is not ok. Do not set receiver status to on"
    }
  }
}

def off() {
  log.debug "off :: Sending off command to the api"
  api("command", '{ "command" : "receiver.powerOff" }') { response ->
    log.debug "off :: Received response for off command: $response.data.message"
    sendEvent(name: "switch", value: "off")
  }
}

def dvd() {
  log.debug "dvd :: Sending dvd command to the api"
  api("command", '{ "command" : "receiver.dvd" }') { response ->
    log.debug "dvd :: Received response for dvd command: $response.data.message"
    sendEvent(name: "inputDVD", value: "on")
    sendEvent(name: "inputDVR", value: "off")
  }
}

def dvr() {
  log.debug "dvr :: Sending dvr command to the api"
  api("command", '{ "command" : "receiver.dvr" }') { response ->
    log.debug "dvr :: Received response for dvr command: $response.data.message"
    sendEvent(name: "inputDVD", value: "off")
    sendEvent(name: "inputDVR", value: "on")
  }
}

def poll() {
  log.debug "poll :: Sending poll command to the api"
  api("status", []) { response ->
    log.debug "poll :: Response: $response.data.message"
    sendEvent(name: "switch", value: "${response.data.message}")
  }
}