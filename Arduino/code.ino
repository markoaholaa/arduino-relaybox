/*
* Home automation system.
* Control devices via MQTT Protocol
* Allows up to 12 devices to be controlled
*/

#include <MKRGSM.h>
#include <MQTT.h>
#include <ArduinoJson.h>

const char pin[]      = "";
const char apn[]      = "internet";
const char login[]    = "";
const char password[] = "";

GSMSSLClient net;
GPRS gprs;
GSM gsmAccess;
GSM_SMS sms;
MQTTClient client;

bool states[] = {false, false, false, false, false, false, false, false, false, false, false, false};

unsigned long lastPublish = 0;
unsigned long lastPublishTwo = 100;

void setup() {
  Serial.begin(115200);
  client.begin("MQTTHOSTNAME", 8883, net);
  client.onMessage(messageReceived);
  Serial.println("Starting to initialize connections.");
  connect();

  for (int i = 0; i <= 11; i++) {
    pinMode(i, OUTPUT);
  }

  for (int i = 0; i <= 11; i++) {
    digitalWrite(i, HIGH);
    delay(100);
    digitalWrite(i, LOW);
  }
}

void loop() {
  client.loop();

  for (int i = 0; i <= 11; i++) {
    if (states[i] == true) {
      digitalWrite(i, HIGH);
    } else {
      digitalWrite(i, LOW);
    }
  }

  if (millis() - lastPublish > 100) {
    StaticJsonDocument<256> status;
    status["group"] = "first";
    status["add0"] = String(states[0]);
    status["add1"] = String(states[1]);
    status["add2"] = String(states[2]);
    status["add3"] = String(states[3]);
    status["add4"] = String(states[4]);
    status["add5"] = String(states[5]);

    char data[128];

    int b = serializeJson(status, data);
    client.publish("homecontrolupdate", data);
    lastPublish = millis();
  }

  if (millis() - lastPublishTwo > 100) {
    StaticJsonDocument<256> status;
    status["group"] = "second";
    status["add6"] = String(states[6]);
    status["add7"] = String(states[7]);
    status["add8"] = String(states[8]);
    status["add9"] = String(states[9]);
    status["add10"] = String(states[10]);
    status["add11"] = String(states[11]);

    char data[128];
    int b = serializeJson(status, data);
    client.publish("homecontrolupdate", data);
    lastPublishTwo = millis();
  }

}

void messageReceived(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);

  if (topic == "homecontrol") {
    int address = payload.toInt();

    if (address < 12) {
      if (states[address] == true) {
        states[address] = false;
      } else {
        states[address] = true;
      }
    } else {
      for (int i = 0; i <= 11; i++) {
        states[i] = false;
      }
    }
  } else if (topic == "homecontroldelete") {
    int address = payload.toInt();

    states[address] = false;    
  }

}

void connect() {
  // connection state
  bool connected = false;

  Serial.print("Connecting to cellular network ...");

  // After starting the modem with gsmAccess.begin()
  // attach to the GPRS network with the APN, login and password
  while (!connected) {
    if ((gsmAccess.begin(pin) == GSM_READY) &&
        (gprs.attachGPRS(apn, login, password) == GPRS_READY)) {
      connected = true;
    } else {
      Serial.print(".");
      delay(1000);
    }
  }

  Serial.print("\nConnecting to MQTT Broker...");
  // 1: Client ID 2: Username 3: Password
  while (!client.connect("arduino", "USERNAME", "PASSWORD")) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nSuccesfully connected to the MQTT Broker!");
  client.subscribe("homecontrol");
  client.subscribe("homecontrolupdate");
  client.subscribe("homecontroldelete");
}
