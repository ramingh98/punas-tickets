<template>
	<loader v-if="loading" />
	<div class="card mb-4">
		<div class="card-body">
			<div class="table-responsive table-responsive-min-height">
				<div class="spinner"
					style="position: absolute; inset: 0px; z-index: 1000; background-color: transparent; display: none;">
					<div style="display:flex;justify-content:center;align-items:center;height:100%">
						<div style="width:80px;height:80px;" class="sk-bounce sk-primary">
							<div class="sk-bounce-dot"></div>
							<div class="sk-bounce-dot"></div>
						</div>
					</div>
				</div>
				<div id="modelList_wrapper" class="dataTables_wrapper dt-bootstrap5 no-footer">
					<table id="modelList" class="table table-striped dataTable no-footer" aria-describedby="modelList_info"
						style="width: 964px;">
						<thead class="bordered-darkorange">
							<tr>
								<th>نام</th>
								<th>نام کسب و کار</th>
								<th>شماره موبایل</th>
								<th>عملیات</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in users" :key="item.Id">
								<td v-text="item.FullName"></td>
								<td v-text="item.BusinesseName"></td>
								<td v-text="item.MobNo"></td>
								<td>
									<button @click="setCustomerId(item.Id)" type="button"
										class="btn rounded-pill btn-primary waves-effect waves-light"
										style="margin-left: 5px;" data-bs-toggle="modal" data-bs-target="#basicModal">
										ارسال تیکت
									</button>
									<RouterLink :to="`/AdminPanel/UserTickets/${item.Id}`">
										<button :style="{ 'white-space': 'nowrap' }" type="button"
											class="btn rounded-pill btn-primary waves-effect waves-light">
											تیکت های مشتری
										</button>
									</RouterLink>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="basicModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel1">ارسال تیکت</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
						@click="resetCustomerId"></button>
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
								<Field :validate-on-input="true" v-model="message" as="textarea" type="text"
									:rules="validateMessage" name="message" class="form-control" />
								<ErrorMessage name="message" />
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
						<button @click="resetCustomerId" type="button" class="btn btn-label-secondary"
							data-bs-dismiss="modal">
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

const toast = useToast();

export default {
	data() {
		return {
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
		setCustomerId: function (Id) {
			this.customerId = Id;
		},
		resetCustomerId: function () {
			this.customerId = null;
		},
		addTicket: function () {
			var $this = this;
			$this.loading = true;
			axios.panelUrl.post('/v1/Tickets/Ticket/AddTicketByUser', {
				"Title": $this.title,
				"TicketId": null,
				"Message": this.message.replace(/\n/g, '<br/>'),
				"FlutterDelta": "-----",
				"SupporterId": null,
				"Rate": null,
				"TicketAttachments": $this.urls,
				"CustomerId": $this.customerId
			}).then(function (result) {
				if (result.data.IsSuccess) {
					$('#basicModal').modal('hide');
					$this.title = '';
					$this.message = '';
					$this.loading = false;
					toast.success('تیکت ارسال شد');
					$this.urls = []
					$this.customerId = null;
				}
			}).catch(function (result) {
				$this.loading = false;
				toast.error("خطای سرور");
				$this.customerId = null;
			})
		},
		getUsers: function () {
			var $this = this;
			$this.users = [];
			$this.loading = true;
			axios.panelUrl.get(`/v1/Identities/Customer/Read`).then(function (result) {
				if (result.data.IsSuccess) {
					$this.users = result.data.Value;
					$this.loading = false;
				}
				else {
					toast.error('خطای سرور', { position: 'top' })
					$this.loading = true;
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
				toast.success(`${self.urls.length} عکس انتخاب شد`)
			}, 1000);
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
		this.getUsers();
	},
}
</script>