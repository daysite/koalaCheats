/* Estilos específicos del panel de administración */
.admin-body {
    background: #0a0a0f;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

.admin-container {
    display: flex;
    min-height: 100vh;
}

/* Sidebar */
.admin-sidebar {
    width: 280px;
    background: linear-gradient(180deg, #0f0f14 0%, #0a0a0f 100%);
    border-right: 1px solid rgba(16, 185, 129, 0.2);
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    overflow-y: auto;
}

.sidebar-header {
    padding: 1.5rem;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-header i {
    font-size: 3rem;
    color: #10b981;
}

.sidebar-header h2 {
    margin-top: 0.5rem;
    font-size: 1.3rem;
}

.admin-nav {
    padding: 1rem 0;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1.5rem;
    color: #ccc;
    text-decoration: none;
    transition: all 0.3s;
    margin: 0.3rem 0;
    cursor: pointer;
}

.nav-item i {
    width: 24px;
}

.nav-item:hover, .nav-item.active {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border-left: 3px solid #10b981;
}

/* Main Content */
.admin-main {
    margin-left: 280px;
    flex: 1;
    padding: 1rem 2rem;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 2rem;
}

.admin-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(16, 185, 129, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 30px;
}

.btn-logout {
    background: none;
    border: none;
    color: #ff4444;
    cursor: pointer;
    font-size: 1.2rem;
}

/* Secciones */
.admin-section {
    display: none;
}

.admin-section.active-section {
    display: block;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: rgba(17, 17, 24, 0.8);
    border-radius: 15px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border: 1px solid rgba(16, 185, 129, 0.2);
}

.stat-card i {
    font-size: 2.5rem;
    color: #10b981;
}

.stat-info h3 {
    font-size: 0.9rem;
    color: #aaa;
    margin-bottom: 0.3rem;
}

.stat-info p {
    font-size: 1.8rem;
    font-weight: bold;
    color: #10b981;
}

/* Tablas */
.table-container {
    overflow-x: auto;
    background: rgba(17, 17, 24, 0.6);
    border-radius: 15px;
    padding: 1rem;
    margin-top: 1rem;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead th {
    text-align: left;
    padding: 1rem;
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    font-weight: 600;
}

tbody td {
    padding: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

tbody tr:hover {
    background: rgba(16, 185, 129, 0.05);
}

/* Botones de acción */
.btn-edit, .btn-delete, .btn-view {
    padding: 0.3rem 0.8rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 0.2rem;
}

.btn-edit {
    background: #3b82f6;
    color: white;
}

.btn-delete {
    background: #ef4444;
    color: white;
}

.btn-view {
    background: #10b981;
    color: white;
}

/* Formularios */
.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #aaa;
}

.form-group input, .form-group textarea, .form-group select {
    width: 100%;
    padding: 0.8rem;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 8px;
    color: white;
}

.filtros {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
    .admin-sidebar {
        width: 80px;
    }
    
    .sidebar-header h2, .nav-item span {
        display: none;
    }
    
    .admin-main {
        margin-left: 80px;
    }
    
    .nav-item {
        justify-content: center;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
