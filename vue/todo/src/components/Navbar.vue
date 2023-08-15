<template>
    <nav class="w-full mb-10 flex flex-grow-0 text-gray-400">
        <ul class="w-full flex justify-between">
            <li>
                <RouterLink to="/home" activeClass="text-teal-500 font-semibold">Home</RouterLink>
            </li>
            <li>
                <RouterLink to="/settings" activeClass="text-teal-500 font-semibold">Settings</RouterLink>
            </li>
        </ul>
    </nav>
</template>