<script setup lang="ts"></script>

<template>
    <main>
        <div>
            <RouterLink class="version-tab" to="/readable">
                Readable version
            </RouterLink>
            <RouterLink class="version-tab disabled" to="/optimized">
                Optimized version
            </RouterLink>
            <RouterLink class="version-tab" to="/extendible">
                Extendible version
            </RouterLink>
        </div>
    </main>
</template>

<style scoped>
.version-tab {
    display: block;
    padding: 8px;
    border: 1px solid white;
    margin: 20px 0;
    text-align: center;
}
.disabled {
    pointer-events: none;
    user-select: none;
    opacity: 0.5;
}
</style>
