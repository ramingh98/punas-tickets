<template>
	<aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
		<div class="app-brand demo mt-3" @click="closeSideBar">
			<router-link to="/AdminPanel/tickets" class="app-brand-link">
				<img src="../../assets/logo.png" style="width: 20%;">
				<span class="app-brand-text demo menu-text fw-bold">پشتیبانی پوناس</span>
			</router-link>
			<a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
				<i class="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
				<i @click="closeSideBar" class="ti ti-x d-block d-xl-none ti-sm align-middle"></i>
			</a>
		</div>
		<div class="menu-inner-shadow"></div>
		<ul class="menu-inner py-1 mt-3">
			<!-- Dashboards -->
			<li class="menu-item active">
				<router-link to="/AdminPanel/tickets" class="menu-link" @click="closeSideBar">
					<i class="menu-icon tf-icons ti ti-smart-home"></i>
					<div data-i18n="Analytics">تیکت ها</div>
				</router-link>
			</li>
		</ul>
	</aside>
</template>

<script>
export default {
	methods: {
		closeSideBar() {
			var element = document.getElementById('layout-menu');
			element.classList.remove("open-menu");
		}
	}
}
</script>

<style></style>