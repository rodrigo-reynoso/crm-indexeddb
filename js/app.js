(function (){
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');
    document.addEventListener('DOMContentLoaded',()=>{
        crearDB();
        if(window.indexedDB.open('crm',1)){
            obtenerClientes();
        }
           
    })
    listadoClientes.addEventListener('click',eliminarCliente);

    function crearDB(){
        const crearDB = window.indexedDB.open('crm', 1);
        // Generalmente se utiliza con function cuando se inicia
        crearDB.onerror = function(){
            console.log('Hubo un error');
        }
        crearDB.onsuccess = function (){
            DB = crearDB.result; // si se crea correctamente se asigna a esta variable para poder utilizar la base de datos indexedDB
        }
        crearDB.onupgradeneeded = function(e){
            const db = e.target.result;
            const objectStore = db.createObjectStore('crm',{keyPath:'id',increment:true});
            objectStore.createIndex('nombre','nombre',{unique:false});
            objectStore.createIndex('email','email',{unique:true});
            objectStore.createIndex('telefono','telefono',{unique:false});
            objectStore.createIndex('empresa','empresa',{unique:false});
            objectStore.createIndex('id','id',{unique:true});
            console.log('Creada y lista')
        }
    }
    function obtenerClientes(){
        const abrirconexion = window.indexedDB.open('crm',1);
        abrirconexion.onerror = function (){
            console.log('Hubo un error');
        }
        abrirconexion.onsuccess = function(){
            DB = abrirconexion.result;
            const objectStore = DB.transaction('crm').objectStore('crm');
            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;
                if(cursor){
                    const {nombre,email,telefono,empresa,id} = cursor.value;
                    listadoClientes.innerHTML += `
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-d border-green-800">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg font-bold">${nombre}</p>
                            <p class="text-sm leading-10 text-gray-700">${email}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-d border-green-200">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-d border-green-200 leading-5 text-gray-700">
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-d border-green-200 leading-5 text-sm">
                            <a class="text-teal-600 hover:text-teal-900 mr-5" href="editar-cliente.html?id=${id}">Editar</a>
                            <a class="text-red-600 hover:text-red-900 eliminar dc" data-cliente="${id}" href="#">Eliminar</a>
                        </td>
                    </tr>
                    `
                    // para pasar parametros en la url se usa ? se conoce como query string
                    cursor.continue();
                }
            }
        }
    } 
    // Esta eliminacion no es muy limpia es mejor cuando se hace scriting en javascript
    function eliminarCliente(e){
        console.log(DB)
        // Esta es la manera de hacerlo cuando se inyecta html con innerHTML, si da click en el ancla entonces seguro quiere eliminarlo
        if(e.target.classList.contains('eliminar')){
             const idEliminar = Number(e.target.dataset.cliente);
            // console.log(idEliminar) Para saber lo que muestra cuando das click
            // HAY UNA LIBRERIA que se llama SUITALERT te da un confirm de otra manera, esta es la manera nativa de javascript
            const confirmar = confirm('Deseas eliminar este cliente?');
            if(confirmar){
                const transaction = DB.transaction(['crm'],'readwrite');
                const objectStore = transaction.objectStore('crm');
                // del atributo del ancla data-cliente  saco el id, es suficiente.. ya que el kyPath es id
                objectStore.delete(idEliminar);
                transaction.oncomplete = function(){
                    console.log('Eliminado correctamente');
                    // La manera de que sea mas interactiva la eliminacion, hay que hacer traversing
                    e.target.parentElement.parentElement.remove();
                }
                transaction.onerror = function(){
                    console.log('Hubo un error');
                }
                return;
            }
        }
        if(e.target.parentElement.parentElement.classList.contains('eliminar')){
            const idEliminar = Number(e.target.parentElement.parentElement.dataset.cliente);
    
           const confirmar = confirm('Deseas eliminar este cliente?');
           if(confirmar){
               const transaction = DB.transaction(['crm'],'readwrite');
               const objectStore = transaction.objectStore('crm');

               objectStore.delete(idEliminar);
               transaction.oncomplete = function(){
                   console.log('Eliminado correctamente');

                   e.target.parentElement.parentElement.parentElement.parentElement.remove();
               }
               transaction.onerror = function(){
                   console.log('Hubo un error');
               }
           }
       }
    }
})()