<aside class="sidebar">
    <nav class="menu">
        <ul class="menu-items">
            <li class="{{ Route::is('board.index') ? 'active' : '' }} menu-item">
                <a href="{{ route('board.index') }}" class="menu-link">
                    <i class="bi bi-kanban"></i>
                    <span class="menu-title">Board</span> <!-- Nome do menu -->
                </a>
            </li>
        </ul>
    </nav>
</aside>
