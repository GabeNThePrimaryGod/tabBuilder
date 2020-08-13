const { ipcRenderer } = require('electron');
const swal = require('sweetalert');

main(); 

async function main()
{
    const personas = await getPersonas();
    const data = await getData();

    showData();
    
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
                console.error(`can't found "${value}" in personas list`);
                swal("Error", `can't found "${value}" in personas list`, "error");
                return;
            }
        }

        if(data[p1][p2] || data[p2][p1])
        {
            overrideData(data, p1, p2, value)
            .then((action) =>
            {
                console.log(action);
        
                if(action === 'override')
                {
                    data[p1][p2] = value;
                    data[p2][p1] = value;
        
                    console.log(`Overriding "${p1}" + "${p2}" fusion with "${value}"`)
                    saveData(data).then(showData);
                }
                else
                {
                    console.log('cancel overriding');
                }
            })
            .catch(console.error);
        }
        else
        {
            data[p1][p2] = value;
            data[p2][p1] = value;

            console.log(`${p1} + ${p2} = ${value}`)
            saveData(data).then(showData);
        }
    });

    refresh_input.addEventListener('click', showData);
}

async function showData()
{
    const dataView = document.getElementById('dataView');

    const datas = await getData();
    const personas = await getPersonas();

    let tab = '';

    // first line
    let isFirstTurn = true;

    tab += '<tr><td style="background-color:lightgrey"></td>';

    for(const persona of personas)
    {        
        tab += `<td style="background-color:lightgrey">${persona}</td>`;
    }

    tab += '</tr>'

    for(const persona of personas)
    {
        tab += "<tr>"
        tab += `<td style="background-color:lightgrey">${persona}</td>`;

        for(const _persona of personas)
        {
            tab += `<td>${(datas[persona][_persona]) ? datas[persona][_persona] : '-'}</td>`;
        }

        tab += "</tr>"
    }

    dataView.innerHTML = tab;
}

function overrideData(data, p1, p2, value)
{
    return new Promise((resolve, reject) => 
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
        .then(resolve)
        .catch(reject);
    })
}

function saveData(data)
{
    console.log(`saving data ...`);

    return new Promise((resolve, reject) => 
    {
        ipcRenderer.send('saveData', data);
        ipcRenderer.once('datasaved', resolve);
    });
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