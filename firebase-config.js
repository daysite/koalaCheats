// ============================================
// CONFIGURACIÓN DE FIREBASE - KOALA CHEATS
// ============================================

// 🔥 TU CONFIGURACIÓN DE FIREBASE (COPIADA DE FIREBASE CONSOLE)
const firebaseConfig = {
    apiKey: "AIzaSyAwuvLfL0n8j8r6ySikHe4BEMEc238oqsM",
    authDomain: "koalacheats.firebaseapp.com",
    databaseURL: "https://koalacheats-default-rtdb.firebaseio.com",
    projectId: "koalacheats",
    storageBucket: "koalacheats.firebasestorage.app",
    messagingSenderId: "186450821507",
    appId: "1:186450821507:web:787840c83e543be7ff36b6",
    measurementId: "G-Q319Q6RVG6"
};

// Inicializar Firebase (VERSIÓN COMPAT - PARA CDN)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

console.log('✅ Firebase conectado correctamente');

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

async function registrarUsuario(email, password, nombre, telefono) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await db.ref('usuarios/' + user.uid).set({
            nombre: nombre,
            email: email,
            telefono: telefono,
            fechaRegistro: new Date().toISOString(),
            rol: 'cliente',
            pedidos: 0,
            totalGastado: 0
        });
        
        await user.sendEmailVerification();
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function iniciarSesion(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function cerrarSesion() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function recuperarContrasena(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function obtenerDatosUsuario(uid) {
    try {
        const snapshot = await db.ref('usuarios/' + uid).once('value');
        return snapshot.val();
    } catch (error) {
        return null;
    }
}

async function actualizarDatosUsuario(uid, datos) {
    try {
        await db.ref('usuarios/' + uid).update(datos);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// FUNCIONES PARA VENTAS EN FIREBASE
// ============================================

async function registrarVentaFirebase(venta) {
    try {
        const newVentaRef = db.ref('ventas').push();
        await newVentaRef.set({
            ...venta,
            fecha: new Date().toISOString(),
            estado: 'pendiente'
        });
        
        const user = auth.currentUser;
        if (user) {
            const userRef = db.ref('usuarios/' + user.uid);
            await userRef.transaction((currentData) => {
                if (currentData) {
                    currentData.pedidos = (currentData.pedidos || 0) + 1;
                    currentData.totalGastado = (currentData.totalGastado || 0) + venta.total;
                }
                return currentData;
            });
        }
        
        return { success: true, id: newVentaRef.key };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function obtenerVentasUsuario(uid) {
    try {
        const snapshot = await db.ref('ventas')
            .orderByChild('usuarioId')
            .equalTo(uid)
            .once('value');
        
        const ventas = [];
        snapshot.forEach(childSnapshot => {
            ventas.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        return ventas;
    } catch (error) {
        return [];
    }
}

// ============================================
// FUNCIONES DE ADMIN
// ============================================

async function esAdmin(uid) {
    try {
        const snapshot = await db.ref('usuarios/' + uid + '/rol').once('value');
        return snapshot.val() === 'admin';
    } catch (error) {
        return false;
    }
}

async function obtenerTodosUsuarios() {
    try {
        const snapshot = await db.ref('usuarios').once('value');
        const usuarios = [];
        snapshot.forEach(childSnapshot => {
            usuarios.push({
                uid: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        return usuarios;
    } catch (error) {
        return [];
    }
}

async function obtenerTodasVentas() {
    try {
        const snapshot = await db.ref('ventas').once('value');
        const ventas = [];
        snapshot.forEach(childSnapshot => {
            ventas.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        return ventas;
    } catch (error) {
        return [];
    }
}
