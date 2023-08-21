<template>
	<div class="card">
		<div class="card-header flex-column flex-md-row">
			<div class="dt-action-buttons pt-3 pt-md-0">
				<div class="dt-buttons btn-group flex-wrap">
					<button type="button" class="btn btn-primary waves-effect waves-light" data-bs-toggle="modal"
						data-bs-target="#basicModal">
						Launch modal
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
								<RouterLink :to="`/Panel/Ticket/${item.TicketId}`">
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
	<div class="modal fade" id="basicModal" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel1">Modal title</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col mb-3">
							<label for="nameBasic" class="form-label">Name</label>
							<input type="text" id="nameBasic" class="form-control" placeholder="Enter Name" />
						</div>
					</div>
					<div class="row g-2">
						<div class="col mb-0">
							<label for="emailBasic" class="form-label">Email</label>
							<input type="email" id="emailBasic" class="form-control" placeholder="xxxx@xxx.xx" />
						</div>
						<div class="col mb-0">
							<label for="dobBasic" class="form-label">DOB</label>
							<input type="date" id="dobBasic" class="form-control" />
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
						Close
					</button>
					<button type="button" class="btn btn-primary">Save changes</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "@/utils/axios";
export default {
	data() {
		return {
			users: [],
		}
	},
	methods: {
		getTickets: function () {
			var $this = this;
			axios.weblUrl.get('/v1/Tickets/Tickets/Read').then(function (result) {
				console.log(result.data);
				if (result.data.IsSuccess) {
					$this.users = result.data.Value
				}
				console.log($this.users);
			})
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