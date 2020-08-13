//const fs = require('fs');
const { ipcRenderer } = require('electron');
const path = require('path');
const sweetalert = require('sweetalert');

main(); 

async function main()
{
    const personas = await getPersonas();
    const data = await getData();
    
    const set_input = document.getElementById('set');
    const refresh_input = document.getElementById('refresh');

    set_input.addEventListener('click', () => 
    {
        const p1 = document.getElementById('p1').value;
        const p2 = document.getElementById('p2').value;
        const value = document.getElementById('value').value;
        
        // check if all personas is existing
        const check = [p1, p2, value];
        for(const persona of check)
        {
            if(!personas.includes(persona))
            {
                console.error(`can't found ${value} in personas list`);
                swal("Error", `can't found ${value} in personas list`, "error");
                return;
            }
        }

        if(data[p1][p2] || data[p2][p1])
        {
            overrideData(data, p1, p2, value);
        }
        else
        {
            data[p1][p2] = value;
            data[p2][p1] = value;

            console.log(`${p1} + ${p2} = ${value}`)
        }

        showData();
        saveData(data);
    });

    refresh_input.addEventListener('click', _=> showData(data));
}

async function showData()
{
    const dataView = document.getElementById('dataView');

    console.log(await getData());
}

function overrideData(data, p1, p2, value)
{
    swal(`This will Override the "${p1}" + "${p2}" fusion which is "${data[p1][p2]}"`,
    {
        buttons: 
        {
            override: "Override",
            cancel: "Cancel"
        },
        icon: "warning"
    })
    .then((action) =>
    {
        console.log(action);

        if(action === 'override')
        {
            data[p1][p2] = value;
            data[p2][p1] = value;

            console.log(`Overriding "${p1}" + "${p2}" fusion with "${value}"`)
        }
        else
        {
            console.log('cancel overriding');
        }
    });
}

async function saveData(data)
{
    console.log(`saving data ...`);
    ipcRenderer.send('saveData', data);
}

function getData()
{
    return new Promise((resolve, reject) => 
    {
        fetch("./data.json")
        .then((res) => res.text())
        .then((text) => JSON.parse(text))
        .then((json) => 
        {
            resolve(json);
        })
        .catch(reject)
    });
}

function getPersonas()
{
    return new Promise((resolve, reject) => 
    {
        fetch("./personas.json")
        .then((res) => res.text())
        .then((text) => JSON.parse(text))
        .then((json) => 
        {
            resolve(json);
        })
        .catch(reject)
    });
}

function buildDefaultDataset(personas)
{
    const dataset = {}

    for(const persona of personas)
    {
        const cell = {}
    
        for(const _persona of personas)
        {
            cell[_persona] = null;
        }
    
        dataset[persona] = cell;
    }
    
    console.log('succesfully built default dataset', dataset);
    return dataset;
}