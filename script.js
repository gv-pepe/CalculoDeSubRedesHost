var primeraIP = null;
function validarDireccionIP(e) {
    var r = e.split(".");
    if (r.length != 4) {
        return false
    }
    for (var n = 0; n < r.length; n++) {
        if (isNaN(r[n]) || r[n] < 0 || r[n] > 255) {
            return false
        }
    }
    return true
}
function defineSiguiente(e, r) {
    var n = e.split(".");
    var a = [parseInt(n[0]), parseInt(n[1]), parseInt(n[2]), parseInt(n[3])];
    var i = Math.pow(2, r);
    for (var t = 0; t < i; t++) {
        a[3]++;
        if (a[3] > 255) {
            a[3] = 0;
            a[2]++;
            if (a[2] > 255) {
                a[2] = 0;
                a[1]++;
                if (a[1] > 255) {
                    a[1] = 0;
                    a[0]++;
                    if (a[0] > 255) {
                        console.log("Fin");
                        return null
                    }
                }
            }
        }
    }
    return a.join(".")
}
function defineAnterior(e, r) {
    var n = e.split(".");
    var a = [parseInt(n[0]), parseInt(n[1]), parseInt(n[2]), parseInt(n[3])];
    var i = Math.pow(2, r) - 1;
    for (var t = 0; t < i; t++) {
        a[3]++;
        if (a[3] > 255) {
            a[3] = 0;
            a[2]++;
            if (a[2] > 255) {
                a[2] = 0;
                a[1]++;
                if (a[1] > 255) {
                    a[1] = 0;
                    a[0]++;
                    if (a[0] > 255) {
                        console.log("Fin");
                        return null
                    }
                }
            }
        }
    }
    return a.join(".")
}
function decimalToBinary(e) {
    var r = e.split(".");
    return r.map(function (e) {
        return ("00000000" + parseInt(e).toString(2)).slice(-8)
    }).join(".")
}


var filaContador = 0; // Contador de filas

function agregarIPaTabla(ip, numero, texto, wil) {
    var table = document.getElementById("ip-table");
    var row = table.insertRow(-1);
    var cellDecimal = row.insertCell(0);
    var cellBinary = row.insertCell(1);
    var cellTexto = row.insertCell(2);
    var cellWildcard = row.insertCell(3);

    cellDecimal.innerHTML = ip;
    cellBinary.innerHTML = decimalToBinary(ip);
    cellTexto.innerHTML = texto;
    cellWildcard.innerHTML = wil;

    if (numero === 1) {
        row.style.backgroundColor = "#75ff65";
    } else if (numero === 2) {
        row.style.backgroundColor = "#ffc16f";
    } else if (numero === 3) {
        row.style.backgroundColor = "#ff78d2";
    }

    filaContador++;

    if (filaContador % 4 === 2) {
        var cellButton = row.insertCell(4);

        if (texto === "255.255.255.252") {
            // Si el valor de 'texto' es igual a "255.255.255.252", crea el "Botón 1"
            var button1 = document.createElement("button");
            button1.innerHTML = "Configura serial";
            button1.addEventListener("click", function () {
                let mensaje = "en<br>" + "conf t<br>" +
                    "int s#/#/#<br>" +
                    "ip address " + ip + " " + texto + "<br>" +
                    "no shut";
                alertify.alert(mensaje, function () {
                }).set('html', true);
            });
            cellButton.appendChild(button1);
        } else {
            // Si no, crea un botón en la fila actual
            var button = document.createElement("button");
            button.innerHTML = "Configura router";
            button.addEventListener("click", function () {
                let mensaje = "en<br>" + "conf t<br>" +
                    "int fa#/#<br>" +
                    "ip address " + ip + " " + texto + "<br>" +
                    "no shut";
                alertify.alert(mensaje, function () {
                }).set('html', true);
            });
            cellButton.appendChild(button);
        }
    } else if (filaContador % 4 === 3 && texto === "255.255.255.252") {
        // Si el valor de 'texto' es igual a "255.255.255.252" y estamos en la siguiente fila (fila 3), crea el "Botón 2"
        var cellButton = row.insertCell(4);
        var button2 = document.createElement("button");
        button2.innerHTML = "Configura serial";
        button2.addEventListener("click", function () {
            let mensaje = "en<br>" + "conf t<br>" +
                    "int s#/#/#<br>" +
                    "ip address " + ip + " " + texto + "<br>" +
                    "no shut";
            alertify.alert(mensaje, function () {
            }).set('html', true);
        });
        cellButton.appendChild(button2);
    }
}





function calcularSiguienteIP() {
    var e = document.getElementById("ip").value;
    var r = parseInt(document.getElementById("n").value);
    if (!validarDireccionIP(e)) {
        alert("La dirección IP ingresada no es válida.");
        return
    }
    if (isNaN(r) || !Number.isInteger(r)) {
        alert("El valor de 'n' ingresado no es un número entero válido.");
        return
    }

    var n = defineSiguiente(e, r);
    var ma = defineUnaMas(e);
    var me = defineDosMenos(n);
    var a = defineAnterior(e, r);


    if (n) {
        document.getElementById("ip").value = n;
        var mascara = calcularMascaraSubred(32 - r);
        var wilcard = calcularMascaraWildcard(32 - r)
        if (!primeraIP) {
            primeraIP = e;
            agregarIPaTabla(primeraIP + " /" + (32 - r), 1, mascara, wilcard);
            agregarIPaTabla(ma, 2, mascara, wilcard);
            agregarIPaTabla(me, 2, mascara, wilcard);
            agregarIPaTabla(a + " /" + (32 - r), 3, mascara, wilcard)
        } else {
            agregarIPaTabla(e + " /" + (32 - r), 1, mascara, wilcard);
            agregarIPaTabla(ma, 2, mascara, wilcard);
            agregarIPaTabla(me, 2, mascara, wilcard);
            agregarIPaTabla(a + " /" + (32 - r), 3, mascara, wilcard);
        }
    }
}
function calcularAnteriorIP() {
    var e = document.getElementById("ip").value;
    var r = parseInt(document.getElementById("n").value);
    if (!validarDireccionIP(e)) {
        alert("La dirección IP ingresada no es válida.");
        return
    }
    if (isNaN(r) || !Number.isInteger(r)) {
        alert("El valor de 'n' ingresado no es un número entero válido.");
        return
    }
    var n = defineAnterior(e, r);
    if (n) {
        agregarIPaTabla(n + "/" + (32 - r + 1))
    }
}
function calcularN() {
    let e = 0;
    let r = 1;
    let n = parseInt(document.getElementById("host").value);
    while (r - 2 < n) {
        r *= 2;
        e++
    }
    document.getElementById("n").value = e
}

function defineUnaMas(ipActual) {
    var octetos = ipActual.split(".");
    var ip = [parseInt(octetos[0]), parseInt(octetos[1]), parseInt(octetos[2]), parseInt(octetos[3])];

    ip[3]++;

    if (ip[3] > 255) {
        ip[3] = 0;
        ip[2]++;

        if (ip[2] > 255) {
            ip[2] = 0;
            ip[1]++;

            if (ip[1] > 255) {
                ip[1] = 0;
                ip[0]++;

                if (ip[0] > 255) {
                    console.log("Fin");
                    return null;
                }
            }
        }
    }

    return ip.join(".");
}

function defineDosMenos(ipActual) {
    var octetos = ipActual.split(".");
    var ip = [parseInt(octetos[0]), parseInt(octetos[1]), parseInt(octetos[2]), parseInt(octetos[3])];

    ip[3] -= 2;

    while (ip[3] < 0) {
        ip[3] += 256;
        ip[2]--;

        while (ip[2] < 0) {
            ip[2] += 256;
            ip[1]--;

            while (ip[1] < 0) {
                ip[1] += 256;
                ip[0]--;

                if (ip[0] < 0) {
                    console.log("Fin");
                    return null;
                }
            }
        }
    }

    return ip.join(".");
}

function calcularMascaraSubred(numero) {
    // Validar que el número esté en el rango válido (1-32)
    if (numero < 1 || numero > 32) {
        return "Número fuera de rango";
    }

    // Inicializar una matriz de 32 elementos, todos en 0
    let mascara = Array(32).fill(0);

    // Establecer los primeros 'numero' elementos en 1
    for (let i = 0; i < numero; i++) {
        mascara[i] = 1;
    }

    // Convertir la matriz de bits en una cadena de texto
    let mascaraString = mascara.join("");

    // Dividir la cadena en grupos de 8 bits y convertirlos a números decimales
    let octetos = [];
    for (let i = 0; i < 4; i++) {
        let octetoBinario = mascaraString.slice(i * 8, (i + 1) * 8);
        let octetoDecimal = parseInt(octetoBinario, 2);
        octetos.push(octetoDecimal);
    }

    // Devolver la máscara de subred en formato X.X.X.X
    return octetos.join(".") + "";
}

function calcularMascaraWildcard(numero) {
    // Validar que el número esté en el rango válido (1-32)
    if (numero < 1 || numero > 32) {
        return "Número fuera de rango";
    }

    // Inicializar una matriz de 32 elementos, todos en 0
    let mascaraWildcard = Array(32).fill(0);

    // Establecer los primeros 'numero' elementos en 1
    for (let i = 0; i < numero; i++) {
        mascaraWildcard[i] = 1;
    }

    // Invertir la matriz de bits para obtener la máscara wildcard
    mascaraWildcard = mascaraWildcard.map(bit => 1 - bit);

    // Convertir la matriz de bits en una cadena de texto
    let wildcardString = mascaraWildcard.join("");

    // Dividir la cadena en grupos de 8 bits y convertirlos a números decimales
    let octetos = [];
    for (let i = 0; i < 4; i++) {
        let octetoBinario = wildcardString.slice(i * 8, (i + 1) * 8);
        let octetoDecimal = parseInt(octetoBinario, 2);
        octetos.push(octetoDecimal);
    }

    // Devolver la máscara wildcard en formato X.X.X.X
    return octetos.join(".");
}


