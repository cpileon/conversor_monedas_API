const arrayDivisas = [
    {
        descripcion: "Unidad de fomento (UF)",
        codigo: "uf",
        unidad: "Pesos"
    },
    {
        descripcion: "Indice de valor promedio (IVP)",
        codigo: "ivp",
        unidad: "Pesos"
    },
    {
        descripcion: "Dólar observado",
        codigo: "dolar",
        unidad: "Pesos"
    }, 
    {
        descripcion: "Dólar acuerdo",
        codigo: "dolar_intercambio",
        unidad: "Pesos"
    }, 
    {
        descripcion: "Euro",
        codigo: "euro",
        unidad: "Pesos"
    }, 
    {
        descripcion: "Indice de Precios al Consumidor (IPC)",
        codigo: "ipc",
        unidad: "Porcentaje"
        
    },
    {
        descripcion: "Unidad Tributaria Mensual (UTM)",
        codigo: "utm",
        unidad: "Pesos"
        
    },
    {
        descripcion: "Imacec",
        codigo: "imacec",
        unidad: "Porcentaje"
    },
    {
        descripcion: "Tasa Política Monetaria (TPM)",
        codigo: "tpm",
        unidad: "Porcentaje"
    }, 
    {
        descripcion: "Libra de cobre",
        codigo: "libra_cobre",
        unidad: "Dólar"

    }, 
    {
        descripcion: "Tasa de desempleo",
        codigo: "tasa_desempleo",
        unidad: "Porcentaje"
    },
    {
        descripcion: "Bitcoin",
        codigo:"bitcoin",
        unidad: "Porcentaje"
    }]
const SelectDivisas = document.querySelector("#selectorMoneda");
const TextResultado = document.querySelector("#resultado");
const buttonConvert = document.querySelector("#btnConvert");
const InputConvertir = document.querySelector("#valorCLP");
let myChart;

async function convertMoney(){
    try{
        let divisa = SelectDivisas.value;

        let endpoint = `https://www.mindicador.cl/api/${divisa}`
        let result = await fetch(endpoint);
        let resultJson = await result.json();
        console.log(resultJson);
        let valorActual = Number(resultJson["serie"][0]["valor"]);
        let converCLP = Number(InputConvertir.value);

        if (converCLP > 0){
            let valorConvertido = (converCLP/valorActual).toFixed(2);
            TextResultado.innerHTML = `${valorConvertido}` ;
            console.log(valorActual);
        } else {
            alert("Por favor coloque un valor superior a cero.");
            return;
        }

        
        //Extraer array con valores y fechas
        let serie = resultJson["serie"];
        console.log("Array con valores y fechas: " + serie);
        return serie;

    }catch(error){
        alert(`Error al ingresar la divisa: ${error}`);
    }

}

function prepareGraph(serie) {
    const typeGraph = "line";
    const colorLine = "#f39b60";
    const title = "Valor moneda"
    const valoresDivisa = serie.map((serie) => serie.valor);
    const fechasDivisa =serie.map((serie) => serie.fecha);
    const tenFechas = fechasDivisa.slice(0,10);
    console.log(valoresDivisa);
    console.log(fechasDivisa);

    //Objeto de configuración
    const config = {
        type: typeGraph,
        data: {
            labels: tenFechas,
            datasets:[
                {
                    label: title,
                    backgroundColor: colorLine,
                    data: valoresDivisa                } 
            ]
        },
        options:{
            plugins:{
                legend:{
                    position: 'top',
                },
                title:{
                    display: true,
                    text: 'Valor durante los últimos 10 días'
                }
                
            }
        }
    };

    return config;
}



let html = SelectDivisas.innerHTML;
arrayDivisas.forEach(val => html += `
<option value=${val.codigo}>${val.descripcion} (Unidad de medida: ${val.unidad})</option>
`)
SelectDivisas.innerHTML = html;

buttonConvert.addEventListener('click', async () =>{
    const serie = await convertMoney();
    const config = prepareGraph(serie);
    const chartDOM = document.querySelector("#myChart");

    if (myChart) {
        myChart.destroy(); 
    }
    myChart = new Chart(chartDOM, config)
});
