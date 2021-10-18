(function(){
    let DB;
    const nombreImput = document.querySelector('#nombre');
    const emailImput = document.querySelector('#email');
    const telefonoImput = document.querySelector('#telefono');
    const empresaImput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');
    let idCliente;
    document.addEventListener('DOMContentLoaded',()=>{

        conectarDB();
        // Verificar el id de la URL
        // Es una API que nos sirve para buscar los parametros que hay en la URL
        const parametrosURL = new URLSearchParams(window.location.search) // forma en la que podemos listar los parametros
        // gracias a URLSearchParams hay una instancia que podemos acceder que es la de get
         idCliente = parametrosURL.get('id');

    if(idCliente){

        setTimeout(()=>{
            obtenerCliente(idCliente);
        },800)
    }
        formulario.addEventListener('submit',confirmarEdicion);
    })
    function confirmarEdicion(e){
        e.preventDefault();
        if(nombreImput===''||emailImput===''||telefonoImput===''||empresa===''){
            console.log('Todos los campos son obligatorios');
            return;
        }
        // como el keypath la llave principal es el id busca por id y remplaza todo el objeto
        console.log('Transancion realizada con exito')
        const cliente = {
            nombre: nombreImput.value,
            email: emailImput.value,
            telefono: telefonoImput.value,
            empresa: empresaImput.value,
            id: Number(idCliente)             
        }
        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(cliente);

        transaction.oncomplete = function(){
            console.log('Transancion realizada con exito')
            setTimeout(()=>{
                window.location.href = 'index.html';
            },3000)
        }
        // Ver porque hubo un error y buscarlo en el objectStore---IMPORTANTE---
        // En este caso es porque por parametro viene en string en idCliente y lo tengo que poner en numero para que lo pueda encontrar con el keypath que es en numero
        /* transaction.onerror = function(e){
            const error = e.target;
            console.log(error)
        } */
        transaction.onerror = function(){
            console.log('Hubo un error');
        }
    }
    function conectarDB(){
        const abrirconexion = window.indexedDB.open('crm',1);
        abrirconexion.onerror = function(){
            console.log('Hubo un error');
        }
        abrirconexion.onsuccess = function(){
            DB = abrirconexion.result;
        }
    }
    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');
        const cliente = objectStore.openCursor();
    
        cliente.onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
                if(cursor.value.id ===Number(id)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }

        }

    }
    function llenarFormulario(datosCliente){
        const { nombre,email,telefono,empresa} = datosCliente;

        nombreImput.value = nombre;
        emailImput.value = email;
        telefonoImput.value = telefono;
        empresaImput.value = empresa;
    }
    
})()