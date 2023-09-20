<template>
	<div class="row">
		<div class="col-md-4 col-lg-3 mb-3 text-center" v-for="item in tickets" :key="item.id">
			<div class="card">
				<h4 class="card-header">عنوان: {{ item.TicketTitle }}</h4>
				<div class="card-body">
					<p>تاریخ ثبت: {{ item.RegDateTime }}</p>
					<div>
						<span v-if="item.Status == 'در انتظار پاسخ'" class="badge bg-label-info">در انتظار
							پاسخ</span>
						<span v-if="item.Status == 'پاسخ داده شده'" class="badge bg-label-success">پاسخ داده
							شده</span>
						<span v-if="item.Status == 'بسته شده'" class="badge bg-label-danger">بسته شده</span>
					</div>
					<div class="mt-4">
						<RouterLink :to="`/AdminPanel/Ticket/${item.TicketId}`">
							<button :style="{ 'white-space': 'nowrap' }" type="button"
								class="btn rounded-pill btn-primary waves-effect waves-light">
								گفتگو ها
							</button>
						</RouterLink>
						<button v-if="item.Status != 'بسته شده'" @click="closeTicket(item.TicketId)"
							:style="{ 'margin-right': '5px' }" type="button"
							class="btn rounded-pill btn-danger waves-effect waves-light m-2">
							بستن
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="card">
		<div class="card-datatable table-responsive">
			<div id="DataTables_Table_1_wrapper" class="dataTables_wrapper dt-bootstrap5">
				<table class="dt-fixedheader table dataTable dtr-column collapsed" id="DataTables_Table_1"
					aria-describedby="DataTables_Table_1_info">
					<thead>
						<tr>
							<th tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1">
								عنوان
							</th>
							<th tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1">
								تاریخ ثبت
							</th>
							<th tabindex="0" aria-controls="DataTables_Table_1" rowspan="1" colspan="1">
								وضعیت
							</th>
							<th :style="{ 'text-align-last': 'center' }">عملیات</th>
						</tr>
					</thead>
					<tbody>
						<loader v-if="loading" />
						<tr v-for="item in tickets" :key="item.id">
							<td v-text="item.TicketTitle">
							</td>

							<td>
								<span v-if="item.Status == 'در انتظار پاسخ'" class="badge bg-label-info">در انتظار
									پاسخ</span>
								<span v-if="item.Status == 'پاسخ داده شده'" class="badge bg-label-success">پاسخ داده
									شده</span>
								<span v-if="item.Status == 'بسته شده'" class="badge bg-label-danger">بسته شده</span>
							</td>
							<td :style="{ 'text-align-last': 'center' }">
								<RouterLink :to="`/AdminPanel/Ticket/${item.TicketId}`">
									<button :style="{ 'white-space': 'nowrap' }" type="button"
										class="btn rounded-pill btn-dark waves-effect waves-light">
										گفتگو ها
									</button>
								</RouterLink>
								<button v-if="item.Status != 'بسته شده'" @click="closeTicket(item.TicketId)"
									:style="{ 'margin-right': '5px' }" type="button"
									class="btn rounded-pill btn-danger waves-effect waves-light m-2">
									بستن
								</button>
							</td>
							<td v-text="item.RegDateTime" class="text-center"></td>
						</tr>
					</tbody>
				</table>
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
			loading: false
		}
	},
	components: {
		Form, Field, ErrorMessage, loader
	},
	methods: {
		getTickets: function () {
			var $this = this;
			$this.loading = true;
			axios.panelUrl.get('/v1/Tickets/Ticket/Read').then(function (result) {
				if (result.data.IsSuccess) {
					$this.tickets = result.data.Value;
					$this.loading = false;
				}
				else {
					toast.error('خطای سرور', {
						// override the global option
						position: 'top'
					})
					$this.loading = false;
				}

			}).catch(function (result) {
				$this.loading = false;
				//toast.error(result)
			})
		},
		closeTicket: function (id) {
			var $this = this;
			swal({
				title: "توجه !",
				text: "آیا از بستن تیکت مطمئن هستید؟",
				icon: "warning",
				dangerMode: true,
				buttons: {
					confirm: 'بله',
					cancel: 'انصراف'
				},
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
					}).catch(function (result) {
						$this.loading = false;
						swal({
							title: "عملیات ناموفق",
							text: "مشکلی در عملیات پیش آمده"
						});
					});
				}
			});
		}
	},
	mounted() {
		this.getTickets();
	},
}
</script>