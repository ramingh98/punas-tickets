<template>
	<div class="card">
		<h5 class="card-header">Fixed Header</h5>
		<div class="card-datatable table-responsive">
			<div id="DataTables_Table_1_wrapper" class="dataTables_wrapper dt-bootstrap5">
				<div class="row">
					<div class="col-sm-12 col-md-6">
						<div class="dataTables_length" id="DataTables_Table_1_length">
							<label>Show
								<select name="DataTables_Table_1_length" aria-controls="DataTables_Table_1"
									class="form-select">
									<option value="7">7</option>
									<option value="10">10</option>
									<option value="25">25</option>
									<option value="50">50</option>
									<option value="75">75</option>
									<option value="100">100</option>
								</select>
								entries
							</label>
						</div>
					</div>
					<div class="col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end">
						<div id="DataTables_Table_1_filter" class="dataTables_filter">
							<label>Search:
								<input type="search" class="form-control" placeholder="" aria-controls="DataTables_Table_1">
							</label>
						</div>
					</div>
				</div>
				<table class="dt-fixedheader table dataTable dtr-column collapsed" id="DataTables_Table_1"
					aria-describedby="DataTables_Table_1_info" style="width: 1046px;">
					<thead>
						<tr>
							<th class="control sorting_disabled" rowspan="1" colspan="1" style="width: 0.953125px;"
								aria-label="">
							</th>
							<th class="sorting_disabled dt-checkboxes-cell dt-checkboxes-select-all" rowspan="1" colspan="1"
								style="width: 17px;" data-col="1" aria-label=""><input type="checkbox"
									class="form-check-input"></th>
							<th class="sorting" tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1"
								style="width: 241.438px;" aria-label="Name: activate to sort column ascending">Name
							</th>
							<th class="sorting" tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1"
								style="width: 228.766px;" aria-label="Email: activate to sort column ascending">Email
							</th>
							<th class="sorting" tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1"
								style="width: 75.9375px;" aria-label="Date: activate to sort column ascending">Date
							</th>
							<th class="sorting" tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1"
								style="width: 73.9219px;" aria-label="Salary: activate to sort column ascending">Salary
							</th>
							<th class="sorting" tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1"
								style="width: 90.9844px;" aria-label="Status: activate to sort column ascending">Status
							</th>
							<th class="sorting_disabled dtr-hidden" rowspan="1" colspan="1"
								style="width: 0px; display: none;" aria-label="Actions">Actions
							</th>
						</tr>
					</thead>
					<tbody>
						<tr class="odd">
							<td class="control" tabindex="0" style="">
							</td>
							<td class="dt-checkboxes-cell" style="">
								<input type="checkbox" class="dt-checkboxes form-check-input">
							</td>
							<td class="" style="">
								<div class="d-flex justify-content-start align-items-center">
									<div class="avatar-wrapper">
										<div class="avatar me-2">
											<span class="avatar-initial rounded-circle bg-label-danger">GG</span>
										</div>
									</div>
									<div class="d-flex flex-column">
										<span class="emp_name text-truncate">Glyn
											Giacoppo
										</span>
										<small class="emp_post text-truncate text-muted">
											Software Test Engineer
										</small>
									</div>
								</div>
							</td>
							<td>ggiacoppo2r@apache.org</td>
							<td class="" style="">04/15/2021</td>
							<td>$24973.48</td>
							<td class="" style="">
								<span class="badge  bg-label-success">Professional</span>
							</td>
							<td class="dtr-hidden" style="display: none;">
								<div class="d-inline-block">
									<a href="javascript:;" class="btn btn-sm btn-icon dropdown-toggle hide-arrow"
										data-bs-toggle="dropdown">
										<i class="text-primary ti ti-dots-vertical"></i>
									</a>
									<div class="dropdown-menu dropdown-menu-end m-0"><a href="javascript:;"
											class="dropdown-item">Details
										</a>
										<a href="javascript:;" class="dropdown-item">Archive
										</a>
										<div class="dropdown-divider">
										</div>
										<a href="javascript:;" class="dropdown-item text-danger delete-record">
											Delete
										</a>
									</div>
								</div>
								<a href="javascript:;" class="btn btn-sm btn-icon item-edit">
									<i class="text-primary ti ti-pencil"></i>
								</a>
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<th class="control" rowspan="1" colspan="1" style=""></th>
							<th rowspan="1" colspan="1" class="" style=""></th>
							<th rowspan="1" colspan="1" class="" style="">Name</th>
							<th rowspan="1" colspan="1">Email</th>
							<th rowspan="1" colspan="1" class="" style="">Date</th>
							<th rowspan="1" colspan="1">Salary</th>
							<th rowspan="1" colspan="1" class="" style="">Status</th>
							<th rowspan="1" colspan="1" class="dtr-hidden" style="display: none;">Action</th>
						</tr>
					</tfoot>
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
</template>
<script>

</script>