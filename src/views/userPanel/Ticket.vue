<template>
	<div class="row g-0">
		<!-- Chat History -->
		<div class="col app-chat-history bg-body">
			<div class="chat-history-wrapper">
				<div class="chat-history-header border-bottom">
					<div class="d-flex justify-content-between align-items-center">
						<div class="d-flex overflow-hidden align-items-center" style="margin-right: 15px;">
							<div class="chat-contact-info flex-grow-1 ms-2">
								<h2 class="m-0">{{ title }}</h2>
							</div>
						</div>
						<div class="d-flex align-items-center">
							<span v-if="status == 'در انتظار پاسخ'" class="badge bg-label-info">
								در انتظار پاسخ
							</span>
							<span v-if="status == 'پاسخ داده شده'" class="badge bg-label-success">
								پاسخ داده شده
							</span>
							<span v-if="status == 'بسته شده'" class="badge bg-label-danger">
								بسته شده
							</span>
						</div>
					</div>
				</div>
				<loader v-if="loading" />
				<div class="chat-history-body bg-body">
					<ul class="list-unstyled chat-history">
						<div class="mt-4" v-for="(item, index) in ticket" :key="index">
							<li v-if="item.SupporterId != null" class="chat-message chat-message-right"
								style="text-align: left;">
								<div class="d-flex overflow-hidden">
									<div class="chat-message-wrapper flex-grow-1 w-50">
										<div class="chat-message-text  chat-background" style="text-align: right;">
											<p class="mb-0" v-html="item.Message" style="color: #05445E;"></p>
											<hr v-if="item.Attachments.length > 0" style="color: #05445E;">
											<div v-for="(attachedFile, fileIndex) in item.Attachments" :key="fileIndex">
												<a target="blank" :href="attachedFile.FilePath"
													style="color: #575b58;">دانلود
													پیوست {{ fileIndex+= 1 }}</a>
											</div>
										</div>
										<div class="text-end text-muted mt-1">
											<small v-text="item.RegDateTime"></small>
										</div>
									</div>
								</div>
							</li>
							<li v-else class="chat-message" style="text-align: right;">
								<div class="d-flex overflow-hidden">
									<div class="chat-message-wrapper flex-grow-1 w-50">
										<div class="chat-message-text"
											style="background-color: #D4F1F4 !important;width: fit-content; border-radius: 5px; padding: 9px;">
											<p class="mb-0 " v-html="item.Message" style="color: #05445E;"></p>
											<hr v-if="item.Attachments.length > 0" style="color: #05445E;">
											<div v-for="(attachedFile, fileIndex) in item.Attachments" :key="fileIndex">
												<a target="blank" :href="attachedFile.FilePath"
													style="color: #2F5233;">دانلود
													پیوست {{ fileIndex+= 1 }}</a>
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

				<div class="chat-history-footer shadow-sm">
					<Form @submit="sendMessage" class="form-send-message d-flex justify-content-between align-items-center">
						<div style="width: 100%; color: black; direction: rtl;border-radius: 200px;">
							<div id="editor">
							</div>
						</div>
						<div class="message-actions d-flex align-items-center">
							<label for="attach-doc" class="form-label mb-0">
								<i class="ti ti-photo ti-sm cursor-pointer mx-3"></i>
								<input ref="fileInput" type="file" id="attach-doc" hidden multiple="multiple"
									@change="handleFileChange" />
							</label>
							<button id="BtnSend" class="btn btn-primary  send-msg-btn" style="margin-left: 15px;">
								<i class="ti ti-send me-md-1 me-0"></i>
								<span class="align-middle d-md-inline-block d-none">ارسال</span>
							</button>
							<br>
							<button type="button" v-if="urls.length > 0" @click="deleteAttachments"
								class="btn btn-danger send-msg-btn">
								<i class="ti ti-x me-md-1 me-0"></i>
								<span class="align-middle d-md-inline-block d-none" style="font-size: 13px;">حذف پیوست
									ها</span>
							</button>
						</div>
					</Form>
					<p style="font-size: 20px;">پسوند تصاویر ارسالی باید JPG و PNG باشد</p>
				</div>
			</div>
		</div>
	</div>
	<div class="app-overlay"></div>
</template>
<script>
import axios from '@/utils/axios';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useToast } from 'vue-toast-notification';
import loader from '@/components/Loader.vue'
import swal from 'sweetalert';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
			loading: false,
			editor: ClassicEditor,
			editorData: ''
		}
	},
	components: {
		Form, Field, ErrorMessage, loader
	},
	mounted() {
		this.getMessages();
		ClassicEditor.create(document.querySelector('#editor'), {
			language: {
				ui: 'en',
				content: 'ar'
			},
			toolbar: {
                items: [
                    'bold',
                    'italic',
                    '|',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'fontFamily',
                    '|',
                    'undo',
                    'redo', '|', "Essentials", "CKFinderUploadAdapter", "Autoformat", "BlockQuote", "CKBox", "Link"
                ]
            }
		}).then(editor => { window.editor = editor; }).catch(err => { console.error(err.stack); });
	},
	methods: {
		scrollTop() {
			window.location.href = "#BtnSend";
		},
		handleFileChange(e) {
			const self = this;
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
			axios.weblUrl.get(`/Tickets/Tickets/Find/${this.id}`).then(function (result) {
				$this.ticket = result.data.Value.CustomerTickets;
				$this.title = result.data.Value.Title
				$this.status = result.data.Value.Status
				$this.loading = false;
				$this.scrollTop();
			}).catch(function () {
				toast.error("خطای سرور");
				$this.loading = false;
			})
		},
		sendMessage: function () {
			var $this = this;
			$this.loading = true;
			const data = editor.getData();
			axios.weblUrl.post('/Tickets/Tickets/AddTicketByUser', {
				"Title": $this.title,
				"TicketId": $this.id,
				"Message": data,
				"FlutterDelta": "-----",
				"SupporterId": null,
				"Rate": null,
				"TicketAttachments": $this.urls,
			}).then(function (result) {
				console.log(result);
				toast.success("پیام ارسال شد");
				$this.title = $this.title;
				editor.setData("<p></p>");
				$this.getMessages();
				$this.loading = false;
			}).catch(function (result) {
				console.log(result);
				toast.warning(result.response.data.Message, {
					// override the global option
					position: 'top'
				});
				$this.loading = false;
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
						text: "تصاویر حذف شدند",
						buttons: 'حله'
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
	background-color: #75E6DA;
	padding: 10px;
	border-radius: 5px;
}

#editor {
	width: 100% !important;
}
</style>