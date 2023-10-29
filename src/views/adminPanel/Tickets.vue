<template>
	<loader v-if="loading" />
	<div class="col-4 mb-3 mt-4" style="margin-right: 12px;">
		<div class="row">
			<label>جستجو بر اساس شناسه:</label>
			<input @keyup="filterById" v-model="ticketId" type="number" class="form-control" />
		</div>
	</div>
	<div class="row">
		<div class="col-md-4 col-lg-3 mb-3 text-center" v-for="item in tickets" :key="item.id">
			<div class="card">
				<h4 class="card-header">ارسال کننده: {{ item.CustomerFullName }}</h4>
				<h4 class="card-header">عنوان: {{ item.TicketTitle }}
				</h4>
				<div class="card-body">
					<p>تاریخ ثبت: {{ item.RegDateTime }}</p>
					<p>تاریخ آخرین گفت و گو: {{ item.ModeDateTime }}</p>
					<div>
						<span v-if="item.Status == 'در انتظار پاسخ'" class="badge bg-label-info">در انتظار پاسخ</span>
						<span v-if="item.Status == 'پاسخ داده شده'" class="badge bg-label-success">
							پاسخ داده شده
						</span> <span v-if="item.Status == 'بسته شده'" class="badge bg-label-danger">بسته شده</span>
					</div>
					<div>
						<p>شناسه : {{ item.TicketId }}</p>
					</div>
					<div>
						<p>وضعیت : {{ item.Read }}</p>
					</div>
					<div class="mt-4">
						<RouterLink :to="`/AdminPanel/Ticket/${item.TicketId}`">
							<button :style="{ 'white-space': 'nowrap' }" type="button"
								class="btn rounded-pill btn-primary waves-effect waves-light">
								گفتگوها </button>
						</RouterLink>
						<button v-if="item.Status != 'بسته شده'" @click="closeTicket(item.TicketId)"
							:style="{ 'margin-right': '5px' }" type="button"
							class="btn rounded-pill btn-danger waves-effect waves-light m-2">بستن</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="basicModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel1"> ارسال تیکت
					</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
					</button>
				</div>
				<Form @submit="addTicket">
					<div class="modal-body">
						<div class="form-group">
							<label>کاربر</label>
							<select class="form-select">
								<option v-for="item in users" :value="item.Value">{{ item.Text }}</option>
							</select>
						</div>
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
								<label for="nameBasic" class="form-label">متن پیام
								</label>
								<Field :validate-on-input="true" v-model="message" as="textarea" type="text"
									:rules="validateMessage" name="message" class="form-control" />
								<ErrorMessage name="message" />
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<p style="font-size: 20px;">پسوند تصاویر JPG و PNG باشد
						</p>
						<label for="attach-doc" class="form-label mb-0">
							<i class="ti ti-photo ti-sm cursor-pointer mx-3">
							</i>
							<input ref="fileInput" type="file" id="attach-doc" hidden multiple="multiple"
								@change="handleFileChange" />
						</label>
						<button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
							بستن
						</button>
						<button type="submit" class="btn btn-primary">ارسال
						</button>
						<button type="button" v-if="urls.length > 0" @click="deleteAttachments"
							class="btn btn-danger send-msg-btn">
							<i class="ti ti-x me-md-1 me-0">
							</i>
							<span class="align-middle d-md-inline-block d-none" style="font-size: 13px;">حذف پیوست ها</span>
						</button>
					</div>
				</Form>
			</div>
		</div>
	</div>
</template>
<script>
import swal from 'sweetalert';
import axios from "@/utils/axios";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useToast } from "vue-toast-notification";
import loader from '@/components/Loader.vue'

const toast = useToast();

export default {
	data() {
		return {
			tickets: [],
			loading: false,
			ticketId: null,
			fileInput: [],
			urls: [],
			users: [],
			message: '',
			customerId: null
		}
	},
	components: {
		Form, Field, ErrorMessage, loader
	},
	methods: {
		filterById: function () {
			var $this = this;
			$this.loading = true;
			$this.tickets = [];
			axios.panelUrl.get(`/v1/Tickets/Ticket/Read/${$this.ticketId}`).then(function (result) {
				console.log(result);
				if (result.data.IsSuccess) {
					$this.tickets = result.data.Value;
					console.log($this.tickets);
					$this.loading = false;
				}
				else {
					toast.error('خطای سرور', { position: 'top' })
					$this.loading = false;
				}
			}).catch(function (result) {
				$this.loading = false;
				toast.error(result.message)
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
				toast.success(`${self.urls.length}عکس انتخاب شد`)
			}, 1000);
		},
		getTickets: function () {
			var $this = this;
			$this.loading = true;
			axios.panelUrl.get('/v1/Tickets/Ticket/Read').then(function (result) {
				console.log(result);
				if (result.data.IsSuccess) {
					$this.tickets = result.data.Value;
					console.log($this.tickets);
					$this.loading = false;
				}
				else {
					toast.error('خطای سرور', { position: 'top' })
					$this.loading = false;
				}

			}).catch(function (result) {
				console.log(result);
				$this.loading = false;
				toast.error(result.message)
			})
		},
		addTicket: function () {
			var $this = this;
			$this.loading = true;
			axios.panelUrl.post('/v1/Tickets/Ticket/AddTicketByUser', {
				"Title": $this.title,
				"TicketId": null,
				"Message": this.message.replace(/\n/g, '<br />'),
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
			if (title == null || title == "" ||
				title.trim() == false) {
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
		closeTicket: function (id) {
			var $this = this;
			swal({
				title: "توجه!",
				text: "آیا از بستن تیکت مطمئن هستید؟",
				icon: "warning",
				dangerMode: true,
				buttons: { confirm: 'بله', cancel: 'انصراف' },
				className: 'align'
			}).then((isConfirmed) => {
				if (isConfirmed) {
					$this.loading = true;
					axios.panelUrl.post(`/v1/Tickets/Ticket/CloseTicket/${id}`).then(function (result) {
						$this.getTickets();
						$this.loading = false;
						swal({
							title: "عملیات موفق",
							text: "تیکت بسته شد"
						});
					}
					).catch(function (result) {
						$this.loading = false;
						swal({
							title: "عملیات	ناموفق",
							text: "مشکلی در عملیات پیش آمده"
						});
					});
				}
			});
		},
	},
	mounted() {
		this.getTickets();
	}
}
</script>
