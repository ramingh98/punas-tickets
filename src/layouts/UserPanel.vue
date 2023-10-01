<template>
	<!-- Layout wrapper -->
	<!-- Layout wrapper -->
	<div class="layout-wrapper layout-content-navbar">
		<div class="layout-container">
			<!-- Menu -->

			<Menu></Menu>
			<!-- / Menu -->
			<loader v-if="loading" />
			<!-- Layout container -->
			<div class="layout-page">
				<!-- Navbar -->
				<Header></Header>
				<!-- / Navbar -->

				<!-- Content wrapper -->
				<div class="content-wrapper">
					<!-- Content -->

					<div class="container-xxl flex-grow-1 container-p-y">
						<router-view></router-view>
					</div>
					<!-- / Content -->

					<!-- Footer -->
					<Footer></Footer>
					<!-- / Footer -->

					<div class="content-backdrop fade"></div>
				</div>
				<!-- Content wrapper -->
			</div>
			<!-- / Layout page -->
		</div>

		<!-- Overlay -->
		<div class="layout-overlay layout-menu-toggle"></div>

		<!-- Drag Target Area To SlideIn Menu On Small Screens -->
		<div class="drag-target"></div>
		<div class="modal fade" id="changePassword" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel1">تغییر کلمه عبور</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<Form @submit="changePassword">
						<div class="modal-body">
							<div class="row">
								<div class="col mb-3">
									<label for="nameBasic" class="form-label">کلمه عبور جدید</label>
									<Field :validate-on-input="true" v-model="password" type="password" name="password"
										:rules="validatePassword" class="form-control" />
									<ErrorMessage name="password" />
								</div>
							</div>
							<div class="row">
								<div class="col mb-3">
									<label for="nameBasic" class="form-label">کلمه عبور جدید</label>
									<Field :validate-on-input="true" v-model="rePassword" type="password" name="rePassword"
										:rules="validateRePassword" class="form-control" />
									<ErrorMessage name="rePassword" />
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
								بستن
							</button>
							<button type="submit" class="btn btn-primary">ارسال</button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from '@/utils/axios';
import { Form, Field, ErrorMessage } from "vee-validate";
import Header from '../components/userPanel/Haeder.vue';
import Footer from '../components/userPanel/Footer.vue';
import Menu from '../components/userPanel/Menu.vue';
import { useToast } from "vue-toast-notification";
import loader from '@/components/Loader.vue'

const toast = useToast();

export default {
	data() {
		return {
			password: '',
			rePassword: '',
			loading: false
		}
	},
	components: {
		Form, Field, ErrorMessage, loader, Menu, Footer, Header
	},
	methods: {
		changePassword: function () {
			var $this = this;
			$this.loading = true;
			axios.weblUrl.post('/Tickets/Tickets/ChangePassword', {
				UserId: 0,
				Password: this.password,
				RePassword: this.password,
				OldPassword: this.password
			}).then(function (result) {
				$('#changePassword').modal('hide');
				toast.success("کلمه ویرایش شد");
				$this.loading = false;
			}).catch(function (result) {
				toast.warning(result.response.data.Message, {
					// override the global option
					position: 'top'
				});
				$this.loading = false;
			})
		},
		validatePassword: function (password) {
			if (password == null || password == "" || password.trim() == false || password.length < 5) {
				return 'پسورد بیشتر از 5 کاراکتر باشد';
			}
			return true;
		},
		validateRePassword: function (rePassword) {
			if (rePassword != this.password) {
				return 'کلمه عبور یکسان نیست';
			}
			return true;
		},
	},
}
</script>

<style></style>