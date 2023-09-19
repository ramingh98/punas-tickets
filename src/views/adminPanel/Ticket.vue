<template>
	<div class="row g-0">
		<!-- Chat History -->
		<div id="scrollTarget" class="col app-chat-history bg-body">
			<div class="chat-history-wrapper">
				<div class="chat-history-header border-bottom">
					<div class="d-flex justify-content-between align-items-center">
						<div class="d-flex overflow-hidden align-items-center">
							<div class="chat-contact-info flex-grow-1 ms-2">
								<h2 class="m-0">{{ title }}</h2>
							</div>
						</div>
						<div class="d-flex align-items-center">
							<h4>{{ status }}</h4>
						</div>
					</div>
				</div>
				<loader v-if="loading" />
				<div class="chat-history-body bg-body">
					<ul class="list-unstyled chat-history">
						<div class="chat-history-body bg-body">
							<ul class="list-unstyled chat-history">
								<div class="mt-4" v-for="(item, index) in ticket" :key="index">
									<li v-if="item.SupporterId != null" class="chat-message chat-message-right"
										style="text-align: right;">
										<div class="d-flex overflow-hidden">
											<div class="chat-message-wrapper flex-grow-1 w-50">
												<div class="chat-message-text"
													style="background-color: #7367f0 !important;width: fit-content; border-radius: 5px; padding: 9px;">
													<p class="mb-0" v-html="item.Message" style="color: white;"></p>
													<div v-for="(attachedFile, fileIndex) in item.Attachments"
														:key="fileIndex">
														<a target="blank" :href="attachedFile.FilePath"
															style="color: white;">دانلود پیوست</a>
													</div>
												</div>
												<div class="text-muted mt-1" style="text-align: right;">
													<small v-text="item.RegDateTime"></small>
												</div>
											</div>
										</div>
									</li>
									<li v-else class="chat-message" style="text-align: left;">
										<div class="d-flex overflow-hidden">
											<div class="chat-message-wrapper flex-grow-1 w-50">
												<div class="chat-message-text">
													<p class="mb-0 chat-background" v-html="item.Message"
														style="color: white;"></p>
													<div v-for="(attachedFile, fileIndex) in item.Attachments"
														:key="fileIndex">
														<a target="blank" :href="attachedFile.FilePath"
															style="color: white;">دانلود
															پیوست</a>
													</div>
												</div>
												<div class="text-muted mt-1">
													<small v-text="item.RegDateTime"></small>
												</div>
											</div>
										</div>
									</li>
								</div>
							</ul>
						</div>
					</ul>
				</div>
				<!-- Chat message form -->
				<div class="chat-history-footer shadow-sm">
					<Form @submit="sendMessage" class="form-send-message d-flex justify-content-between align-items-center">
						<Field as="textarea" :rules="validateMessage" name="message" :validate-on-input="true"
							class="form-control message-input border-0 me-3 shadow-none" v-model="message"
							placeholder="متن پیام را وارد نمایید ..." style="height: 100px;width: 64%;" />
						<div class="message-actions d-flex align-items-center">
							<p style="font-size: 20px;">پسوند تصاویر JPG و PNG باشد</p>
							<label for="attach-doc" class="form-label mb-0">
								<i class="ti ti-photo ti-sm cursor-pointer mx-3"></i>
								<input ref="fileInput" type="file" id="attach-doc" hidden multiple="multiple"
									@change="handleFileChange" />
							</label>
							<button id="BtnSend" class="btn btn-primary  send-msg-btn" style="margin-left: 15px;">
								<i class="ti ti-send me-md-1 me-0"></i>
								<span class="align-middle d-md-inline-block d-none">ارسال</span>
							</button>
							<button type="button" v-if="urls.length > 0" @click="deleteAttachments"
								class="btn btn-danger send-msg-btn">
								<i class="ti ti-x me-md-1 me-0"></i>
								<span class="align-middle d-md-inline-block d-none" style="font-size: 13px;">حذف پیوست
									ها</span>
							</button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from '@/utils/axios';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useToast } from 'vue-toast-notification';
import loader from '@/components/Loader.vue'
import swal from 'sweetalert';

const toast = useToast();

export default {
	data() {
		return {
			id: '',
			ticket: {},
			message: '',
			title: '',
			status: '',
			fileInput: [],
			urls: [],
			loading: false
		}
	},
	components: {
		Form, Field, ErrorMessage, loader
	},
	mounted() {
		this.getMessages();
	},
	methods: {
		scrollTop() {
			window.location.href = "#BtnSend";
		},
		handleFileChange(e) {
			const self = this;
			self.urls = [];
			const fileInput = this.$refs.fileInput;
			for (let i = 0; i < fileInput.files.length; i++) {
				let reader = new FileReader();
				const file = fileInput.files[i];
				reader.onload = function (event) {
					self.urls.push(event.target.result);
				};
				reader.readAsDataURL(file);
			}
			setTimeout(() => {
				toast.success(`${self.urls.length} عکس انتخاب شد`)
				console.log(self.urls);
			}, 1000);
		},
		getMessages: function () {
			this.id = this.$route.params.id;
			var $this = this;
			$this.loading = true;
			axios.panelUrl.get(`/v1/Tickets/Ticket/Find/${this.id}`).then(function (result) {
				$this.ticket = result.data.Value.CustomerTickets;
				$this.title = result.data.Value.Title
				$this.status = result.data.Value.Status
				$this.loading = false;
				$this.scrollTop();
			}).catch(function (result) {
				console.log(result);
				toast.error("خطای سرور")
				$this.loading = false;
			})
		},
		sendMessage: function () {
			var $this = this;
			$this.loading = true;
			axios.panelUrl.post('/v1/Tickets/Ticket/AddTicketByUser', {
				"Title": $this.title,
				"TicketId": $this.id,
				"Message": this.message.replace(/\n/g, '<br/>'),
				"FlutterDelta": "-----",
				"SupporterId": null,
				"Rate": null,
				"TicketAttachments": $this.urls,
			}).then(function (result) {
				console.log(result);
				toast.success("پیام ارسال شد");
				$this.message = '';
				$this.getMessages();
				$this.urls = [];
				$this.loading = false;
			}).catch(function (result) {
				$this.loading = false;
				toast.error(result.response.data.Message);
			})
		},
		deleteAttachments: function () {
			var $this = this;
			swal({
				title: "توجه !",
				text: "آیا از حذف تصاویر انتخاب شده مطمئن هستید؟",
				icon: "warning",
				dangerMode: true,
				buttons: {
					confirm: 'بله',
					cancel: 'انصراف'
				},
				className: 'align'
			}).then((isConfirmed) => {
				if (isConfirmed) {
					$this.urls = []
					swal({
						title: "عملیات موفق",
						text: "تصاویر حذف شدند"
					});
				}
			});
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
<style scoped>
.chat-background {
	color: black !important;
	display: inline-block;
	background-color: rgb(191, 249, 255);
	padding: 10px;
	border-radius: 5px;
}
</style>