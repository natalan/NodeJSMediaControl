/**
 *  Smartthings integration with Samsung Smart TV
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
  definition (name: "Smart TV", namespace: "belmass@gmail.com", author: "Andrei Zharov", description: "Smartthings integration with Samsung Smart TV", category: "Convenience") {
    capability "Switch"
    capability "Polling"
  }

  tiles {

    standardTile("switch", "device.switch", width: 2, height: 2) {
      state "off", label: '${name}', action: "switch.on", icon: "st.Electronics.electronics18", backgroundColor: "#ffffff"
      state "on", label: '${name}', action: "switch.off", icon: "st.Electronics.electronics18", backgroundColor: "#79b821"
    }

    standardTile("onTester", "device.image", width: 1, height: 1) {
      state "on", label: "turn on", action: "switch.on", icon: "", backgroundColor: "#79b821"
    }

    main "switch"
    details (["switch", "onTester"])
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
    "off": [
      uri: "https://${server}",
      path: "/api/tv/power",
      type: "get", 
      headers: [Authorization: "$userPass"]
    ],
    "on": [
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
  log.debug "doRequest :: Sending $params.type request to $params.uri$params.path"
  if (params.type == "get") {
    httpGet(params, success)
  } else if (params.type == "post") {
    httpPostJson(params, success)
  }
}

def parse(String description) {

}

def on() {
  log.debug "on :: Sending on command to the api"
  api("on", [
    "command": "tv.power"
  ]) { response ->
    log.debug "on :: Response: $response.data.message"
    if (response.data.message == "ok") {
      sendEvent(name: "switch", value: "on")
    } else {
      log.debug "on :: Message is not ok. Do not set tv status to on"
    }
  }
}

def off() {
  log.debug "off :: Sending off command to the api"
  api("off", []) { response ->
    log.debug "off :: Received response for off command: $response.data.message"
    sendEvent(name: "switch", value: "off")
  }
}

def poll() {
  log.debug "poll :: Sending poll command to the api"
  api("status", []) { response ->
    log.debug "poll :: Response: $response.data.message"
    sendEvent(name: "switch", value: "${response.data.message}")
  }
}