<template>
	<div class="container-xxl flex-grow-1 container-p-y">
		<div class="app-chat card overflow-hidden">
			<div class="row g-0">
				<!-- Chat History -->
				<div class="col app-chat-history bg-body">
					<div class="chat-history-wrapper">
						<div class="chat-history-header border-bottom">
							<div class="d-flex justify-content-between align-items-center">
								<div class="d-flex overflow-hidden align-items-center">
									<i class="ti ti-menu-2 ti-sm cursor-pointer d-lg-none d-block me-2"
										data-bs-toggle="sidebar" data-overlay data-target="#app-chat-contacts"></i>
									<div class="flex-shrink-0 avatar">

									</div>
									<div class="chat-contact-info flex-grow-1 ms-2">
										<h3 class="m-0">{{ title }}</h3>
									</div>
								</div>
							</div>
						</div>
						<div class="chat-history-body bg-body">
							<ul class="list-unstyled chat-history">
								<div v-for="item in ticket">
									<li v-if="item.SupporterId != null" class="chat-message chat-message-right">
										<div class="d-flex overflow-hidden">
											<div class="chat-message-wrapper flex-grow-1 w-50">
												<div class="chat-message-text">
													<p class="mb-0" v-text="item.Message"></p>
												</div>
												<div class="text-end text-muted mt-1">
													<small v-text="item.RegDateTime"></small>
												</div>
											</div>
										</div>
									</li>
									<li v-else class="chat-message">
										<div class="d-flex overflow-hidden">
											<div class="chat-message-wrapper flex-grow-1 w-50">
												<div class="chat-message-text">
													<p class="mb-0" v-text="item.Message"></p>
												</div>
												<div class="text-end text-muted mt-1">
													<small v-text="item.RegDateTime"></small>
												</div>
											</div>
										</div>
									</li>
								</div>
							</ul>
						</div>
						<!-- Chat message form -->
						<div class="chat-history-footer shadow-sm">
							<Form @submit="sendMessage"
								class="form-send-message d-flex justify-content-between align-items-center">
								<Field as="" :rules="validateMessage" name="message" :validate-on-input="true"
									class="form-control message-input border-0 me-3 shadow-none" v-model="message"
									placeholder="متن پیام را وارد نمایید ..." />
								<div class="message-actions d-flex align-items-center">
									<i class="speech-to-text ti ti-microphone ti-sm cursor-pointer"></i>
									<label for="attach-doc" class="form-label mb-0">
										<i class="ti ti-photo ti-sm cursor-pointer mx-3"></i>
										<input type="file" id="attach-doc" hidden />
									</label>
									<button class="btn btn-primary d-flex send-msg-btn">
										<i class="ti ti-send me-md-1 me-0"></i>
										<span class="align-middle d-md-inline-block d-none">Send</span>
									</button>
								</div>
							</Form>
						</div>
					</div>
				</div>
				<!-- /Chat History -->

				<!-- Sidebar Right -->
				<div class="col app-chat-sidebar-right app-sidebar overflow-hidden" id="app-chat-sidebar-right">
					<div
						class="sidebar-header d-flex flex-column justify-content-center align-items-center flex-wrap px-4 pt-5">
						<div class="avatar avatar-xl avatar-online">
						</div>
						<h6 class="mt-2 mb-0">Felecia Rower</h6>
						<span>NextJS Developer</span>
						<i class="ti ti-x ti-sm cursor-pointer close-sidebar d-block" data-bs-toggle="sidebar" data-overlay
							data-target="#app-chat-sidebar-right"></i>
					</div>
					<div class="sidebar-body px-4 pb-4">
						<div class="my-4">
							<p class="text-muted text-uppercase">About</p>
							<p class="mb-0 mt-3">
								A Next. js developer is a software developer who uses the Next. js framework alongside
								ReactJS
								to build web applications.
							</p>
						</div>
						<div class="my-4">
							<p class="text-muted text-uppercase">Personal Information</p>
							<ul class="list-unstyled d-grid gap-2 mt-3">
								<li class="d-flex align-items-center">
									<i class="ti ti-mail"></i>
									<span class="align-middle ms-2">josephGreen@email.com</span>
								</li>
								<li class="d-flex align-items-center">
									<i class="ti ti-phone-call"></i>
									<span class="align-middle ms-2">+1(123) 456 - 7890</span>
								</li>
								<li class="d-flex align-items-center">
									<i class="ti ti-clock"></i>
									<span class="align-middle ms-2">Mon - Fri 10AM - 8PM</span>
								</li>
							</ul>
						</div>
						<div class="mt-4">
							<p class="text-muted text-uppercase">Options</p>
							<ul class="list-unstyled d-grid gap-2 mt-3">
								<li class="cursor-pointer d-flex align-items-center">
									<i class="ti ti-badge"></i>
									<span class="align-middle ms-2">Add Tag</span>
								</li>
								<li class="cursor-pointer d-flex align-items-center">
									<i class="ti ti-star"></i>
									<span class="align-middle ms-2">Important Contact</span>
								</li>
								<li class="cursor-pointer d-flex align-items-center">
									<i class="ti ti-photo"></i>
									<span class="align-middle ms-2">Shared Media</span>
								</li>
								<li class="cursor-pointer d-flex align-items-center">
									<i class="ti ti-trash"></i>
									<span class="align-middle ms-2">Delete Contact</span>
								</li>
								<li class="cursor-pointer d-flex align-items-center">
									<i class="ti ti-ban"></i>
									<span class="align-middle ms-2">Block Contact</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<!-- /Sidebar Right -->
				<div class="app-overlay"></div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from '@/utils/axios';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useToast } from 'vue-toast-notification';

const toast = useToast();

export default {
	data() {
		return {
			id: '',
			ticket: {},
			message: '',
			title: ''
		}
	},
	components: {
		Form, Field, ErrorMessage
	},
	mounted() {
		this.getMessages();
	},
	methods: {
		getMessages: function () {
			this.id = this.$route.params.id;
			var $this = this;
			axios.weblUrl.get(`/v1/Tickets/Tickets/Find/${this.id}`).then(function (result) {
				$this.ticket = result.data.Value.CustomerTickets;
				$this.title = result.data.Value.Title
			}).catch(function () {
				toast.error("خطای سرور")
			})
		},
		sendMessage: function () {
			var $this = this;
			axios.weblUrl.post('/v1/Tickets/Tickets/AddTicketByUser', {
				"Title": $this.message,
				"TicketId": $this.id,
				"Message": $this.message,
				"FlutterDelta": "-----",
				"SupporterId": null,
				"Rate": null,
				"TicketAttachments": null
			}).then(function (result) {
				console.log(result);
				toast.success("پیام ارسال شد");
				$this.message = '';
				$this.getMessages();
			}).catch(function (result) {
				toast.warning(result.response.data.Message);
			})
		},
		validateMessage: function (message) {
			if (message == null || message == "" || message.trim() == false) {
				return 'متن پیام الزامیست';
			}
			return true;
		}
	},
}
</script>