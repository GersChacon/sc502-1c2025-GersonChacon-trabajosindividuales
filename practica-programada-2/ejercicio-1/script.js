function calcular() {
    let salBruto = parseFloat(document.getElementById('salBruto').value);
    let enfermedaMaternidad = 0.055;
    let invalidezMuerte = 0.0267;
    let fondoObligatorioPensiones = 0.01;
    let impuestoRenta = 0;
    let salNeto = 0;

    let rebajoEnfermedaMaternidad = salBruto * enfermedaMaternidad
    let rebajoInvalidezMuerte = salBruto * invalidezMuerte
    let rebajoFondoObligatorioPensiones = salBruto * fondoObligatorioPensiones

    if (salBruto <= 863000) {
        salBruto = salBruto;
    }
    else if (salBruto > 863000 && salBruto <= 1267000) {
        impuestoRenta = (salBruto - 863000) * 0.10;
    }
    else if (salBruto > 1267000 && salBruto <= 2223000) {
        impuestoRenta = (salBruto - 1267000) * 0.15;
    }
    else if (salBruto > 2223000 && salBruto <= 4445000) {
        impuestoRenta = (salBruto - 2223000) * 0.20;
    }
    else if (salBruto > 4445000) {
        impuestoRenta = (salBruto - 4445000) * 0.25;
    }
    salNeto = salBruto - rebajoEnfermedaMaternidad - rebajoFondoObligatorioPensiones - rebajoInvalidezMuerte - impuestoRenta;
    document.getElementById('result').innerText = salNeto;
    document.getElementById('rebajo1').innerText = rebajoEnfermedaMaternidad;
    document.getElementById('rebajo2').innerText = rebajoInvalidezMuerte;
    document.getElementById('rebajo3').innerText = rebajoFondoObligatorioPensiones;
    document.getElementById('rebajo4').innerText = impuestoRenta;
}