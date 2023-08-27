<template>
	<div class="container-xxl flex-grow-1 container-p-y">
		<div class="app-chat card overflow-hidden">
			<div class="row g-0">
				<!-- Chat History -->
				<!-- <div class="col app-chat-history bg-body">
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
										<input ref="fileInput" type="file" id="attach-doc" hidden />
									</label>
									<button class="btn btn-primary d-flex send-msg-btn">
										<i class="ti ti-send me-md-1 me-0"></i>
										<span class="align-middle d-md-inline-block d-none">Send</span>
									</button>
								</div>
							</Form>
						</div>
					</div>
				</div> -->
				<div class="col app-chat-history bg-body">
					<div class="chat-history-wrapper">
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
					</div>
				</div>
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
			title: '',
			fileInput: null
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
			const file = this.$refs.fileInput.files[0];

			const reader = new FileReader();
			reader.onload = () => {
				this.fileInput = reader.result;
			};
			reader.readAsDataURL(file);


			const filelist = [];
			filelist.push();
			axios.weblUrl.post('/v1/Tickets/Tickets/AddTicketByUser', {
				"Title": $this.message,
				"TicketId": $this.id,
				"Message": $this.message,
				"FlutterDelta": "-----",
				"SupporterId": null,
				"Rate": null,
				"TicketAttachments": this.fileInput,
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