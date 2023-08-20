<template>
	<div class="authentication-wrapper authentication-cover authentication-bg">
		<div class="authentication-inner row">
			<!-- /Left Text -->
			<div class="d-none d-lg-flex col-lg-7 p-0">
				<div class="auth-cover-bg auth-cover-bg-color d-flex justify-content-center align-items-center">
					<img src="../../../public/assets/img/illustrations/auth-forgot-password-illustration-light.png"
						alt="auth-forgot-password-cover" class="img-fluid my-5 auth-illustration"
						data-app-light-img="illustrations/auth-forgot-password-illustration-light.png"
						data-app-dark-img="illustrations/auth-forgot-password-illustration-dark.png" />

					<img src="../../../public/assets/img/illustrations/bg-shape-image-light.png"
						alt="auth-forgot-password-cover" class="platform-bg"
						data-app-light-img="illustrations/bg-shape-image-light.png"
						data-app-dark-img="illustrations/bg-shape-image-dark.png" />
				</div>
			</div>
			<!-- /Left Text -->

			<!-- Forgot Password -->
			<div class="d-flex col-12 col-lg-5 align-items-center p-sm-5 p-4">
				<div class="w-px-400 mx-auto">
					<!-- Logo -->
					<div class="app-brand mb-4">
						<a href="index.html" class="app-brand-link gap-2">
							<span class="app-brand-logo demo">
								<svg width="32" height="22" viewBox="0 0 32 22" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd"
										d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
										fill="#7367F0" />
									<path opacity="0.06" fill-rule="evenodd" clip-rule="evenodd"
										d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
										fill="#161616" />
									<path opacity="0.06" fill-rule="evenodd" clip-rule="evenodd"
										d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
										fill="#161616" />
									<path fill-rule="evenodd" clip-rule="evenodd"
										d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
										fill="#7367F0" />
								</svg>
							</span>
						</a>
					</div>
					<!-- /Logo -->
					<h3 class="mb-1 fw-bold">ثبت نام 🔒</h3>
					<div v-if="sendPhone == true" id="sendPhone">
						<p class="mb-4">جهت ثبت نام شماره موبایل خود را وارد نمایید.</p>
						<Form @submit="submit" id="formAuthentication" class="mb-3" method="POST">
							<div class="mb-3">
								<label for="email" class="form-label">شماره موبایل</label>
								<Field class="form-control" type="text" :rules="phoneNumberValidation" v-model="phoneNumber"
									name="phoneNumber" :validateOnInput="true" autofocus />
								<ErrorMessage name="phoneNumber" />
							</div>
							<button type="submit" class="btn btn-primary w-100">
								<i id="icon" class="fa fa-spinner fa-spin fade"></i>
								<span class="ml-4">دریافت کد تایید</span>
							</button>
						</Form>
					</div>
					<div v-if="sendPhone == false" id="sendPhone">
						<p class="mb-4">کد تایید را وارد نمایید.</p>
						<Form @submit="confirm" id="formAuthentication" class="mb-3" method="POST">
							<div class="mb-3">
								<label for="email" class="form-label">کد تایید</label>
								<Field class="form-control" type="text" :rules="confirmCodeValidation" v-model="confirmCode"
									name="confirmCode" :validateOnInput="true" autofocus />
								<ErrorMessage name="confirmCode" />
							</div>
							<button type="submit" class="btn btn-primary w-100">
								<i id="icon" class="fa fa-spinner fa-spin fade"></i>
								<span class="ml-4">دریافت کد تایید</span>
							</button>
						</Form>
					</div>
				</div>
			</div>
			<!-- /Forgot Password -->
		</div>
	</div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { useToast } from 'vue-toast-notification';
import axios from '../../utils/axios'
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();

export default {
	data() {
		return {
			sendPhone: true,
			phoneNumber: '',
			confirmCode: ''
		}
	},
	components: {
		Form, Field, ErrorMessage
	},
	methods: {
		submit: function () {
			var $this = this;
			$("#icon").show();
			axios.post("/v1/Identities/ConfirmationCodes/AddForRegister", {
				UserName: this.phoneNumber
			}).then(function (result) {
				if (result.data.IsSuccess) {
					localStorage.setItem("HashId", result.data.Value.HashId);
					$this.sendPhone = false;
					toast.success("کد تایید ارسال شد")
				}
				else {
					toast.error(result.data.Message);
				}
				console.log(result.data);
			}).catch(function () {
				toast.error('مشکلی در عملیات بوجود آمد');
			})
		},
		confirm: function () {
			var $this = this;
			axios.post('/v1/Identities/ConfirmationCodes/Confirm', {
				HashId: localStorage.getItem("HashId"),
				UserName: $this.phoneNumber,
				ConfirmCode: $this.confirmCode
			}).then(function (result) {
				if (result.data.IsSuccess) {
					toast.success("شماره موبایل شما تایید شد")
				}
				else {
					toast.error(result.data.Message);
				}
			}).catch(function (result) {
				toast.error('مشکلی در عملیات بوجود آمد');
			})
		},
		phoneNumberValidation: function (phoneNumber) {
			var pattern = new RegExp("^[0-9]{11}$");
			if (!pattern.test(phoneNumber)) {
				return 'شماره موبایل معتبر وارد نمایید';
			}
			return true
		},
		confirmCodeValidation: function (confirmCode) {
			var pattern = new RegExp('^[0-9]+$');
			if (!pattern.test(confirmCode)) {
				return 'کد تایید معتبر وارد نمایید';
			}
			return true;
		}
	}
}
</script>
<style></style>