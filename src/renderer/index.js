const fs = require('fs');
const path = require('path');

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
        const value = (document.getElementById('value').value === 'null') ? null : document.getElementById('value').value;

        // sécurité 0 %
        if(personas.includes(value))
        {
            console.log(`${p1} + ${p2} = ${value}`);

            data[p1][p2] = value;
            data[p2][p1] = value;

            saveData(data);
        }
        else
        {
            console.error(`can't found ${value} in personas list`)
        }
    });

    refresh_input.addEventListener('click', _=> showData(data));
}

async function showData(data)
{
    const dataView = document.getElementById('dataView');

    console.log(await getData());
}

function saveData(data)
{
    console.log(`saving data ...`);

    try
    {
        fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data));
        console.log('succesfully saved data', data);
    } 
    catch (err)
    { 
        console.error(err);
    }
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