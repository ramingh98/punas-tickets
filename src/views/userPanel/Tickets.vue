<template>
	<loader v-if="loading" />
	<div class="card-header flex-column flex-md-row">
		<div class="dt-action-buttons pt-3 pt-md-0">
			<div class="dt-buttons btn-group flex-wrap">
				<button type="button" class="btn btn-primary waves-effect waves-light" data-bs-toggle="modal"
					data-bs-target="#basicModal">
					ارسال تیکت
				</button>
			</div>
		</div>
	</div>
	<div class="row mt-4">
		<div class="col-md-4 col-lg-3 mb-3 text-center" v-for="item in tickets" :key="item.id">
			<div class="card">
				<h4 class="card-header">عنوان: {{ item.Title }}</h4>
				<div class="card-body">
					<p>تاریخ ثبت: {{ item.RegDateTime }}</p>
					<div>
						<span v-if="item.Status == 'در انتظار پاسخ'" class="badge bg-label-info">
							در انتظار پاسخ
						</span>
						<span v-if="item.Status == 'پاسخ داده شده'" class="badge bg-label-success">
							پاسخ داده شده
						</span>
						<span v-if="item.Status == 'بسته شده'" class="badge bg-label-danger">
							بسته شده
						</span>
					</div>
					<div>
						<p>شناسه : {{ item.TicketId }}</p>
					</div>
					<div class="mt-4">
						<RouterLink :to="`/UserPanel/Ticket/${item.TicketId}`">
							<button :style="{ 'white-space': 'nowrap' }" type="button"
								class="btn rounded-pill btn-primary waves-effect waves-light">
								گفتگو ها
							</button>
						</RouterLink>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="basicModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel1">ارسال تیکت</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<Form @submit="addTicket">
					<div class="modal-body">
						<div class="row">
							<div class="col mb-3">
								<label for="nameBasic" class="form-label">عنوان</label>
								<Field :validate-on-input="true" v-model="title" type="text" name="title"
									:rules="validateTitle" class="form-control" />
								<ErrorMessage name="title" />
							</div>
						</div>
						<div class="row">
							<div class="col mb-3">
								<label for="nameBasic" class="form-label">متن پیام</label>
								<div style="width: 100%; color: black; direction: rtl;border-radius: 200px;">
									<div id="editor">
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<p style="font-size: 20px;">پسوند تصاویر JPG و PNG باشد</p>
						<label for="attach-doc" class="form-label mb-0">
							<i class="ti ti-photo ti-sm cursor-pointer mx-3"></i>
							<input ref="fileInput" type="file" id="attach-doc" hidden multiple="multiple"
								@change="handleFileChange" />
						</label>
						<button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
							بستن
						</button>
						<button type="submit" class="btn btn-primary">ارسال</button>
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
</template>
<script>
import axios from "@/utils/axios";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useToast } from "vue-toast-notification";
import loader from '@/components/Loader.vue'
import swal from 'sweetalert';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const toast = useToast();

export default {
	data() {
		return {
			tickets: [],
			title: '',
			message: '',
			loading: false,
			fileInput: [],
			urls: [],
			editor: ClassicEditor,
			editorData: ''
		}
	},
	components: {
		Form, Field, ErrorMessage, loader
	},
	methods: {
		getTickets: function () {
			var $this = this;
			$this.loading = true;
			axios.weblUrl.get('/Tickets/Tickets/Read').then(function (result) {
				if (result.data.IsSuccess) {
					$this.tickets = result.data.Value
				}
				else {
					toast.error('خطای سرور')
				}
				$this.loading = false;
			}).catch(function (result) {
				$this.loading = false;
				toast.error('خطای سرور')
			})
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
			}, 1000);
		},
		addTicket: function () {
			var $this = this;
			$this.loading = true;
			const data = editor.getData()
			axios.weblUrl.post('/v1/Tickets/Tickets/AddTicketByUser', {
				"Title": $this.title,
				"TicketId": null,
				"Message": data,
				"FlutterDelta": "-----",
				"SupporterId": null,
				"Rate": null,
				"TicketAttachments": $this.urls,
			}).then(function (result) {
				if (result.data.IsSuccess) {
					$('#basicModal').modal('hide');
					$this.title = '';
					$this.message = '';
					$this.getTickets();
					$this.loading = false;
					toast.success('تیکت ارسال شد');
					$this.urls = []
				}
			}).catch(function (result) {
				$this.loading = false;
				toast.error("خطای سرور");
			})
		},
		validateTitle: function (title) {
			if (title == null || title == "" || title.trim() == false) {
				return 'عنوان الزامیست';
			}
			return true;
		},
		validateMessage: function (message) {
			if (message == null || message == "" || message.trim() == false) {
				return 'متن پیام الزامیست';
			}
			return true;
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
	},
	mounted() {
		this.getTickets();
		$('#basicModal').modal({
			focus: false,
		});
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
}
</script>
<style>
:root {
	--ck-z-default: 100;
	--ck-z-modal: calc(var(--ck-z-default) + 999);
}
</style>