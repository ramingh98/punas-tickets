<template>
	<div class="card">
		<div class="card-datatable table-responsive">
			<div id="DataTables_Table_1_wrapper" class="dataTables_wrapper dt-bootstrap5">
				<table class="dt-fixedheader table dataTable dtr-column collapsed" id="DataTables_Table_1"
					aria-describedby="DataTables_Table_1_info" style="width: 1046px;">
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
						<loader v-if="showLoader" />
						<tr v-for="item in tickets" :key="item.id">
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
							<td :style="{ 'text-align-last': 'center' }">
								<RouterLink :to="`/AdminPanel/Ticket/${item.Id}`">
									<button type="button" class="btn rounded-pill btn-dark waves-effect waves-light">
										گفتگو ها
									</button>
								</RouterLink>
								<button v-if="item.Status != 'بسته شده'" @click="closeTicket(item.Id)"
									:style="{ 'margin-right': '5px' }" type="button"
									class="btn rounded-pill btn-danger waves-effect waves-light">
									بستن
								</button>
							</td>
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
			showLoader: false
		}
	},
	components: {
		Form, Field, ErrorMessage, loader
	},
	methods: {
		getTickets: function () {
			var $this = this;
			
			axios.panelUrl.get('/Tickets/Ticket/Read').then(function (result) {
				if (result.data.IsSuccess) {
					$this.tickets = result.data.Value
					console.log(result.data);
				}
				else {
					toast.error('خطای سرور')
				}
			})
		},
		closeTicket: function (id) {
			var $this = this;
			
			swal({
				title: "توجه !",
				text: "آیا از بستین تیکت مطمئن هستید؟",
				icon: "warning",
				dangerMode: true,
				buttons: 'بله',
				className: 'align'
			}).then(() => {
				$this.showLoader = true;
				axios.panelUrl.post(`/Tickets/Ticket/CloseTicket/${id}`).then(function (result) {
					console.log(result);
					$this.getTickets();
					$this.showLoader = false;
					swal(result);
				}).catch(function (result) {
					$this.showLoader = false;
					swal(result);
				})

			});
		}
	},
	mounted() {
		this.getTickets();
	},
}
</script>