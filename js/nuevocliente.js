(function(){

    let DB;
    const formulario = document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded',()=>{
        conertarDB();
        formulario.addEventListener('submit',validarFormulario);

    })
    function conertarDB(){
        // Esta es la misma operativa que cuando se crea la base de datos de indexedDB
        const abrirconexion = window.indexedDB.open('crm',1)
        abrirconexion.onerror = function (){
            console.error('Hubo un error');
        }
        abrirconexion.onsuccess = function (){
            DB = abrirconexion.result;
            console.log('conexion abierta...')
        }

    }
    function validarFormulario(e){
        e.preventDefault();
        
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;
        if(nombre ===''||email ===''||telefono===''||empresa===''){
            imprimirAlerta('Todos los campos son obligatorios','error')
            return;
        }
        // Crear un object literal lo contrario a destruning, no es necesario agregar el valor solo con la llave, ya que es la misma que el valor
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        }
        cliente.id = Date.now();
        crearNuevoCliente(cliente);
    }
    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.add(cliente);

        transaction.onerror = function(){
            console.log('hubo un error');
        }
        transaction.oncomplete = function(){
            console.log('cliente agregado...')
            imprimirAlerta('El cliente se agrego correctamente');
            setTimeout(()=>{
                window.location.href ='index.html';
                
            },3000)
        }
    }
    function imprimirAlerta(mensaje,tipo){
        const alerta = document.querySelector('.alerta');
        if(!alerta){ // Si no esta la clase esa agrega el mensaje, asi me permite que no se repita el mensaje cuando doy submit
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','border','alerta');
            if(tipo==='error'){
                divMensaje.classList.add('bg-red-100','border-red-400','text-red-700');
            } else {
                divMensaje.classList.add('bg-green-100','border-green-400','text-green-700');
            }
            divMensaje.textContent = mensaje;
            formulario.appendChild(divMensaje);
            setTimeout(()=>{
                divMensaje.remove();
            },3000)
        }

    }
})();