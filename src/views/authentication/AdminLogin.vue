<template>
	<div class="container-xxl">
		<div class="authentication-wrapper authentication-basic container-p-y">
			<div class="authentication-inner py-4">
				<!-- Login -->
				<div class="card">
					<div class="card-body">
						<!-- Logo -->
						<div class="app-brand justify-content-center mb-4 mt-2">
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
								<span class="app-brand-text demo text-body fw-bold ms-1">پویا نگار ارتباط سپهر</span>
							</a>
						</div>
						<!-- /Logo -->
						<p class="mb-4 text-center">پنل مدیریت</p>
						<Form @submit="submit" id="formAuthentication" class="mb-3" action="index.html" method="POST">
							<div class="mb-3">
								<label class="form-label">نام کاربری</label>
								<Field type="text" class="form-control" :rules="userNameValidation" v-model="userName"
									name="userName" :validateOnInput="true" autofocus />
								<ErrorMessage name="userName" />
							</div>
							<div class="mb-3">
								<label class="form-label">کلمه عبور</label>
								<Field type="password" class="form-control" :rules="passwordValidation" v-model="password"
									name="password" :validateOnInput="true" autofocus />
								<ErrorMessage name="password" />
							</div>
							<div class="mb-3">
								<button class="btn btn-primary d-grid w-100" type="submit">ورود</button>
							</div>
						</Form>
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

const toast = useToast();

export default {
	data() {
		return {
			userName: '',
			password: ''
		}
	},
	components: {
		Form, Field, ErrorMessage
	},
	methods: {
		submit: function () {
			var $this = this;
			axios.panelUrl.post("/v1/Identities/Authentication/Login", {
				UserName: this.userName,
				Password: this.password
			}).then(function (result) {
				if (result.data.IsSuccess) {
					localStorage.setItem("token", result.data.Value.Token);
					localStorage.setItem("role", "admin");
					toast.success("ورود موفقیت آمیز به سیستم");
					window.location.href = "/AdminPanel/tickets";
				}
				else {
					toast.error(result.data.Message);
				}
			}).catch(function (result) {
				console.log(result);
				toast.error('مشکلی در عملیات بوجود آمد');
			})
		},
		userNameValidation: function (userName) {
			if (userName == null || userName == "" || userName.trim() == false) {
				return 'نام کاربری الزامیست';
			}
			return true
		},
		passwordValidation: function (password) {
			if (password == null || password == "" || password.trim() == false) {
				return 'کلمه عبور الزامیست';
			}
			return true;
		}
	}
}
</script>
<style></style>