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
							<th>عملیات</th>
						</tr>
					</thead>
					<tbody>
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
							<td>
								<RouterLink :to="`/AdminPanel/Ticket/${item.Id}`">
									<button type="button" class="btn rounded-pill btn-dark waves-effect waves-light">
										گفتگو ها
									</button>
								</RouterLink>
							</td>
						</tr>
					</tbody>
				</table>
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
			tickets: [],
		}
	},
	components: {
		Form, Field, ErrorMessage
	},
	methods: {
		getTickets: function () {
			var $this = this;
			axios.panelUrl.get('/v1/Tickets/Ticket/Read').then(function (result) {
				if (result.data.IsSuccess) {
					$this.tickets = result.data.Value
					console.log(result.data);
				}
				else {
					toast.error('خطای سرور')
				}
			})
		},
	},
	mounted() {
		this.getTickets();
	},
}
</script>