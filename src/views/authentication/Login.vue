<template>
	<div class="container-xxl">
		<div class="authentication-wrapper authentication-basic container-p-y">
			<div class="authentication-inner py-4">
				<!-- Login -->
				<loader v-if="loading" />
				<div class="card">
					<div class="card-body">
						<!-- Logo -->
						<div class="text-center">
							<img src="../../assets/logo.png" style="width: 20%;">
							<span class="app-brand-text demo menu-text fw-bold">پویا نگار ارتباط سپهر</span>
							<!-- /Logo -->
							<h4 class="mb-3 pt-2">به سیستم پشتیبانی پوناس خوش آمدید!</h4>
						</div>
						<div v-if="loginWithUserName == true" id="sendPhone">
							<p class="mb-4 mt-3">جهت ورود به حساب کاربری نام کاربری و کلمه عبور خود را وارد نمایید</p>
							<Form @submit="login" id="formAuthentication" class="mb-3" action="index.html" method="POST">
								<div class="mb-3">
									<label for="email" class="form-label">نام کاربری</label>
									<Field type="text" class="form-control" :rules="phoneNumberValidation"
										v-model="phoneNumber" name="phoneNumber" :validateOnInput="true" autofocus />
									<ErrorMessage name="phoneNumber" />
								</div>
								<div class="mb-3">
									<label for="email" class="form-label">کلمه عبور</label>
									<Field type="password" class="form-control" :rules="passwordValidation"
										v-model="password" name="password" :validateOnInput="true" />
									<ErrorMessage name="password" />
								</div>
								<div class="mb-3">
									<button class="btn btn-primary d-grid w-100" type="submit">ورود</button>
								</div>
							</Form>
							<a @click="toggleLogin" style="cursor: pointer; color: rgb(0, 128, 255);">
								ورود با کد تایید
							</a>
						</div>
						<div v-else>
							<div v-if="sendPhone == true" id="sendPhone">
								<p class="mb-4">جهت ورود به حساب کاربری نام کاربری خود را وارد نمایید</p>
								<Form @submit="submit" id="formAuthentication" class="mb-3" action="index.html"
									method="POST">
									<div class="mb-3">
										<label for="email" class="form-label">نام کاربری</label>
										<Field type="text" class="form-control" :rules="phoneNumberValidation"
											v-model="phoneNumber" name="phoneNumber" :validateOnInput="true" autofocus />
										<ErrorMessage name="phoneNumber" />
									</div>
									<div class="mb-3">
										<button class="btn btn-primary d-grid w-100" type="submit">ورود</button>
									</div>
								</Form>
								<a @click="toggleLogin" style="cursor: pointer; color: rgb(0, 128, 255);">
									ورود با نام کاربری
								</a>
							</div>
							<div v-if="sendPhone == false" id="sendPhone">
								<p class="mb-4">کد تایید ارسال شده را وارد نمایید</p>
								<Form @submit="confirm" id="formAuthentication" class="mb-3" action="index.html"
									method="POST">
									<div class="mb-3">
										<label for="email" class="form-label">کد تایید</label>
										<Field type="text" class="form-control" :rules="confirmCodeValidation"
											v-model="confirmCode" name="confirmCode" :validateOnInput="true" autofocus />
										<ErrorMessage name="confirmCode" />
									</div>
									<div class="mb-3">
										<button class="btn btn-primary d-grid w-100" type="submit">ورود</button>
									</div>
								</Form>
								<a @click="reSendCode" style="cursor: pointer; color: rgb(0, 128, 255);">
									ارسال مجدد
								</a>
							</div>
						</div>
					</div>
				</div>
				<!-- /Register -->
			</div>
		</div>
	</div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { useToast } from 'vue-toast-notification';
import axios from '../../utils/axios'
import loader from '@/components/Loader.vue'

const toast = useToast();

export default {
	data() {
		return {
			loginWithUserName: true,
			sendPhone: true,
			phoneNumber: '',
			confirmCode: '',
			loading: false,
			password: ''
		}
	},
	components: {
		Form, Field, ErrorMessage, loader
	},
	methods: {
		login: function () {
			var $this = this;
			$this.loading = true;
			axios.weblUrl.post('/api/Identities/ConfirmationCodes/LoginWithUserName', {
				UserName: this.phoneNumber,
				Password: this.password
			}).then(function (result) {
				if (result.data.IsSuccess) {
					localStorage.setItem("token", result.data.Value.Token);
					localStorage.setItem("role", "user");
					toast.success("ورود موفقیت آمیز به سیستم", {
						// override the global option
						position: 'top'
					});
					window.location.href = "/userPanel/tickets";
					$this.loading = false;
				}
				else {
					toast.error(result, {
						position: 'top'
					});
					$this.loading = false;
				}
			}).catch(function (result) {
				toast.error(result.response.data.Message, {
					position: 'top'
				});
				$this.loading = false;
			})
		},
		submit: function () {
			var $this = this;
			$this.loading = true;
			$("#icon").show();
			axios.weblUrl.post("/api/Identities/ConfirmationCodes/AddForLogin", {
				UserName: this.phoneNumber
			}).then(function (result) {
				if (result.data.IsSuccess) {
					localStorage.setItem("HashId", result.data.Value.HashId);
					$this.sendPhone = false;
					toast.success("کد تایید ارسال شد", {
						position: 'top'
					});
					$this.loading = false;
				}
				else {
					toast.error(result, {
						position: 'top'
					});
					$this.loading = false;
				}
			}).catch(function (result) {
				toast.error(result.response.data.Message, {
					// override the global option
					position: 'top'
				});
				$this.loading = false;
			})
		},
		confirm: function () {
			var $this = this;
			$this.loading = true;
			axios.weblUrl.post('/api/Identities/ConfirmationCodes/Login', {
				HashId: localStorage.getItem("HashId"),
				UserName: $this.phoneNumber,
				ConfirmCode: $this.confirmCode
			}).then(function (result) {
				if (result.data.IsSuccess) {
					localStorage.setItem("token", result.data.Value.Token);
					localStorage.setItem("role", "user");
					toast.success("ورود موفقیت آمیز به سیستم", {
						// override the global option
						position: 'top'
					});
					window.location.href = "/userPanel/tickets";
					$this.loading = false;
				}
				else {
					toast.error(result.Message, {
						// override the global option
						position: 'top'
					});
					$this.loading = false;
				}
			}).catch(function (result) {
				toast.error(result.response.data.Message, {
					// override the global option
					position: 'top'
				});
				$this.loading = false;
			})
		},
		reSendCode: function () {
			var $this = this;
			$this.loading = true;
			$("#icon").show();
			axios.weblUrl.post("/api/Identities/ConfirmationCodes/AddForLogin", {
				UserName: this.phoneNumber
			}).then(function (result) {
				if (result.data.IsSuccess) {
					localStorage.removeItem("HashId");
					localStorage.setItem("HashId", result.data.Value.HashId);
					toast.success("کد تایید ارسال شد", {
						position: 'top'
					});
					$this.loading = false;
				}
				else {
					toast.error(result, {
						position: 'top'
					});
					$this.loading = false;
				}
			}).catch(function (result) {
				toast.error(result.response.data.Message, {
					// override the global option
					position: 'top'
				});
				$this.loading = false;
			})
		},
		phoneNumberValidation: function (phoneNumber) {
			var pattern = new RegExp(/^09\d{9}$/);
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
		},
		passwordValidation: function (password) {
			if (password == null || password == "" || password.trim() == false) {
				return 'کلمه عبور را وارد نمایید';
			}
			return true;
		},
		toggleLogin: function () {
			this.loginWithUserName = !this.loginWithUserName
			this.phoneNumber = '';
			this.password = ''
		}
	}
}
</script>
<style scoped>
body {
	overflow: hidden !important;
}
</style>