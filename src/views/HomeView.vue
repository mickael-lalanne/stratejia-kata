<script setup lang="ts"></script>

<template>
    <main>
        <div>
            <RouterLink class="version-tab" to="/readable">
                Readable version
            </RouterLink>
            <RouterLink class="version-tab" to="/optimized">
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
}
</style>
