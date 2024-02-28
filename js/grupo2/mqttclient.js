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
var registros = [];

client.onMessageArrived = function (message) {
    try {
        // Parsea el mensaje JSON recibido
        let response = JSON.parse(message.payloadString);

        // Verifica si el mensaje es un arreglo y contiene datos
        if (Array.isArray(response) && response.length >0) {
            // Actualiza la tabla con los nuevos datos
            updateTable(response);
        }else{
            document.getElementById("temperaturaValue").textContent = response.temperatura;
            document.getElementById("cpuValue").textContent = response.rendimiento_cpu + '%';
            document.getElementById("memoriaValue").textContent = response.rendimiento_memoria + '%';
            document.getElementById("redValue").textContent = response.rendimiento_red + ' bytes';
        }

        // Imprime el mensaje recibido en la consola si es necesario
        console.log("Mensaje recibido:", response);
    } catch (error) {
        console.error("Error al procesar el mensaje:", error);
    }
};

// Función para actualizar la tabla con los nuevos datos
function updateTable(data) {
    registros = data; // Actualiza los registros

    var tabla = document.getElementById("Tabla");
    // Elimina todas las filas existentes en la tabla, incluidos los encabezados
    tabla.innerHTML = "";

    // Agrega una nueva fila para los encabezados
    var filaEncabezado = tabla.insertRow(0);
    var encabezados = ["Fecha/Hora", "Mac Address", "CPU", "Memoria", "Red", "Temperatura"];
    for (var i = 0; i < encabezados.length; i++) {
        var encabezado = filaEncabezado.insertCell(i);
        encabezado.innerHTML = "<b>" + encabezados[i] + "</b>";
    }

    // Agrega las filas con los datos recibidos
    for (let i = 0; i < registros.length; i++) {
        var fila = tabla.insertRow(i);
        var registro = registros[i];
        // Agrega las celdas con los datos del registro
        fila.insertCell(0).innerHTML = registro.fecha_hora;
        fila.insertCell(1).innerHTML = registro.mac;
        fila.insertCell(2).innerHTML = registro.cpu + '%';
        fila.insertCell(3).innerHTML = registro.memoria + '%';
        fila.insertCell(4).innerHTML = registro.red + ' bytes';
        fila.insertCell(5).innerHTML = registro.temperatura;
    }
}

var options = {
	timeout: 3,
	onSuccess: function () {
		console.log("mqtt connected");
		// Connection succeeded; subscribe to our topic, you can add multile lines of these
		client.subscribe("Taller MQTT", { qos: 1 });
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
