<template>
	<nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
		id="layout-navbar">
		<div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
			<a @click="openSidbar()" class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
				<i class="ti ti-menu-2 ti-sm"></i>
			</a>
		</div>

		<div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
			<div class="navbar-nav align-items-center">
				<a class="nav-link style-switcher-toggle hide-arrow" href="javascript:void(0);">
					<i class="ti ti-sm"></i>
				</a>
			</div>

			<ul class="navbar-nav flex-row align-items-center ms-auto">
				<li class="nav-item me-2 me-xl-0">
					<span class="fw-semibold d-block">{{ userName }}</span>
				</li>
				<!-- User -->
				<li class="nav-item navbar-dropdown dropdown-user dropdown">
					<a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
						<div class="avatar">
							<img src="https://file.punas.ir/files/TicketAvatars/1.png" alt class="rounded-circle" />
						</div>
					</a>
					<ul class="dropdown-menu dropdown-menu-end">
						<li>
							<a @click="logOut" class="dropdown-item" href="#">
								<i class="ti ti-logout me-2 ti-sm"></i>
								<span class="align-middle">خروج</span>
							</a>
						</li>

					</ul>
				</li>
				<!--/ User -->
			</ul>
		</div>
	</nav>
</template>

<script>
export default {
	methods: {
		logOut: function () {
			localStorage.clear();
		},
		openSidbar() {
			var element = document.getElementById('layout-menu');
			element.classList.add("open-menu");
		}
	},
	computed: {
		userName() {
			return this.$store.state.adminName;
		},
	},
	created() {
		// در اینجا می‌توانید از اکشنی که نام کاربر را از API دریافت می‌کند فراخوانی کنید
		this.$store.dispatch('getAdminName');
	},
};
</script>

<style>
.open-menu {
	transform: translate3d(0, 0, 0) !important;
}
</style>