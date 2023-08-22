<template>
	<div class="card">
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
		<div class="card-datatable table-responsive">
			<div id="DataTables_Table_1_wrapper" class="dataTables_wrapper dt-bootstrap5">
				<table class="dt-fixedheader table dataTable dtr-column collapsed" id="DataTables_Table_1"
					aria-describedby="DataTables_Table_1_info" style="width: 1046px;">
					<thead>
						<tr>
							<th class="control sorting_disabled" rowspan="1" colspan="1" aria-label="">
							</th>
							<th class="sorting" tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1"
								aria-label="Name: activate to sort column ascending">عنوان
							</th>
							<th class="sorting" tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1"
								aria-label="Date: activate to sort column ascending">تاریخ ثبت
							</th>
							<th class="sorting" tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1"
								aria-label="Status: activate to sort column ascending">وضعیت
							</th>
							<th>عملیات</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in users" :key="item.id">
							<td class="control" tabindex="0" style=""></td>
							<td v-text="item.Title">
							</td>
							<td v-text="item.RegDateTime"></td>
							<td>
								<span v-if="item.Status == 'در انتظار پاسخ'" class="badge bg-label-info">در انتظار
									پاسخ</span>
								<span v-if="item.Status == 'پاسخ داده شده'" class="badge bg-label-success">پاسخ داده
									شده</span>
								<span v-if="item.Status == 'بسته شده'" class="badge bg-label-danger">بسته شده</span>
							</td>
							<td>
								<RouterLink :to="`/UserPanel/Ticket/${item.TicketId}`">
									<button type="button" class="btn rounded-pill btn-dark waves-effect waves-light">
										گفتگو ها
									</button>
								</RouterLink>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="row">
					<div class="col-sm-12 col-md-6">
						<div class="dataTables_info" id="DataTables_Table_1_info" role="status" aria-live="polite">Showing 1
							to 7 of 100 entries
						</div>
					</div>
					<div class="col-sm-12 col-md-6">
						<div class="dataTables_paginate paging_simple_numbers" id="DataTables_Table_1_paginate">
							<ul class="pagination">
								<li class="paginate_button page-item previous disabled" id="DataTables_Table_1_previous"><a
										href="#" aria-controls="DataTables_Table_1" data-dt-idx="previous" tabindex="0"
										class="page-link">
										Previous
									</a>
								</li>
								<li class="paginate_button page-item active">
									<a href="#" aria-controls="DataTables_Table_1" data-dt-idx="0" tabindex="0"
										class="page-link">1</a>
								</li>
								<li class="paginate_button page-item next" id="DataTables_Table_1_next"><a href="#"
										aria-controls="DataTables_Table_1" data-dt-idx="next" tabindex="0"
										class="page-link">
										Next()
									</a>
								</li>
							</ul>
						</div>
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
								<Field :validate-on-input="true" v-model="message" as="textarea" type="text"
									:rules="validateMessage" name="message" class="form-control" />
								<ErrorMessage name="message" />
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
							بستن
						</button>
						<button type="submit" class="btn btn-primary">ارسال</button>
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
const toast = useToast();
export default {
	data() {
		return {
			users: [],
			title: '',
			message: ''
		}
	},
	components: {
		Form, Field, ErrorMessage
	},
	methods: {
		getTickets: function () {
			var $this = this;
			axios.weblUrl.get('/v1/Tickets/Tickets/Read').then(function (result) {
				if (result.data.IsSuccess) {
					$this.users = result.data.Value
				}
				else {
					toast.error('خطای سرور')
				}
			})
		},
		addTicket: function () {
			var $this = this;
			axios.weblUrl.post('/v1/Tickets/Tickets/AddTicketByUser', {
				"Title": $this.title,
				"TicketId": null,
				"Message": $this.message,
				"FlutterDelta": "-----",
				"SupporterId": null,
				"Rate": null,
			}).then(function (result) {
				if (result.data.IsSuccess) {
					$('#basicModal').modal('hide');
					$this.title = '';
					$this.message = '';
					$this.getTickets();
					toast.success('تیکت ارسال شد');
				}
			}).catch(function () {
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
		}
	},
	alert: function () {
		alert("Ted")
	},
	mounted() {
		this.getTickets();
	},
}
</script>