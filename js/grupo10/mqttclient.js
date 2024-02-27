/*################################################################################################*/
/*####################################### CLIENTE MQTT ###########################################*/
/*################################################################################################*/

//var wsbroker = "0.tcp.sa.ngrok.io";
var wsbroker = "broker.hivemq.com";
//var wsbroker = "localhost";

//var wsport = 14792; // port for above
var wsport = 1883; // port for above
var client = new Paho.MQTT.Client(
	wsbroker,
	//Number(wsport),
	Number(8000),
	"myclientid_" + parseInt(Math.random() * 100, 10)
);

client.onConnectionLost = function (responseObject) {
	console.log("connection lost: " + responseObject.errorMessage);
};

/*################################################################################################*/
/*####################################### LLEGA EL MENSAJE########################################*/
/*################################################################################################*/
let prevCPUValue = 0;
let prevMemoryValue = 0;
let prevDiskValue = 0;
let prevRecepcionValue = 0;

client.onMessageArrived = function (message) {
    try {
        // Parsea el mensaje JSON recibido
        let response = JSON.parse(message.payloadString);

        // Actualiza los elementos HTML con los datos del mensaje
        document.getElementById("temperaturaValue").innerHTML = response.temperatura;
        document.getElementById("cpuValue").innerHTML = response.rendimiento_cpu + '%';
        document.getElementById("memoriaValue").innerHTML = response.rendimiento_memoria + '%';
        document.getElementById("redValue").innerHTML = response.rendimiento_red.toFixed(2) + ' bytes';
        
        // Imprime el mensaje recibido en la consola si es necesario
        console.log("Mensaje recibido:", response);
    } catch (error) {
        console.error("Error al procesar el mensaje:", error);
    }
};

// Función para calcular el porcentaje de cambio
function calculatePercentage(diff, prevValue) {
    if (prevValue === 0) {
        return "0"; // Si el valor anterior es cero, el porcentaje de cambio es cero
    }

    let percentage = ((diff / prevValue) * 100).toFixed(2);
    if (isFinite(percentage)) {
        return percentage >= 0 ? "+" + percentage : percentage;
    } else {
        return "0";
    }
}
// Función para obtener el porcentaje coloreado
function getColoredPercentage(percentage) {
    if (parseFloat(percentage) > 0) {
        return '<span style="color: green;">' + percentage + '%</span>';
    } else if (parseFloat(percentage) < 0) {
        return '<span style="color: red;">' + percentage + '%</span>';
    } else {
        return percentage + '%';
    }
}

var options = {
	timeout: 3,
	onSuccess: function () {
		console.log("mqtt connected");
		// Connection succeeded; subscribe to our topic, you can add multile lines of these
		client.subscribe("Probar_1", { qos: 1 });
	},
	onFailure: function (message) {
		console.log("Connection failed: " + message.errorMessage);
	},
};


function testMqtt(){
	console.log("hi");
}
function initMqtt() {
	client.connect(options);
}
