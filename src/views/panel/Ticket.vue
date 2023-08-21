<template>
	<div class="col app-chat-history bg-body">
		<div class="chat-history-wrapper">

			<div class="chat-history-body bg-body">
				<ul class="list-unstyled chat-history">
					<li v-for="item in ticket.CustomerTickets" class="chat-message">
						<div v-if="item.SupporterId == null" class="d-flex overflow-hidden">
							<div class="user-avatar flex-shrink-0 me-3">
								<div class="avatar avatar-sm">
								</div>
							</div>
							<div class="chat-message-wrapper flex-grow-1">
								<div class="chat-message-text">
									<p class="mb-0" v-text="item.Message"></p>
								</div>
								<div class="text-muted mt-1">
									<small v-text="item.RegDateTime"></small>
								</div>
							</div>
						</div>
						<div v-else class="d-flex overflow-hidden" style="text-align: left;">
							<div class="user-avatar flex-shrink-0 me-3">
								<div class="avatar avatar-sm">
								</div>
							</div>
							<div class="chat-message-wrapper flex-grow-1">
								<div class="chat-message-text">
									<p class="mb-0" v-text="item.Message"></p>
								</div>
								<div class="text-muted mt-1">
									<small v-text="item.RegDateTime"></small>
								</div>
							</div>
						</div>
					</li>
					<!-- <li class="chat-message">
						<div class="d-flex overflow-hidden" >
							<div class="chat-message-wrapper flex-grow-1 w-50">
								<div class="chat-message-text">
									<p class="mb-0">
										Yes that's correct documentation file, Design files are included with the template.
									</p>
								</div>
								<div class="text-end text-muted mt-1">
									<i class="ti ti-checks ti-xs me-1"></i>
									<small>10:15 AM</small>
								</div>
							</div>
							<div class="user-avatar flex-shrink-0 ms-3">
								<div class="avatar avatar-sm">
								</div>
							</div>
						</div>
					</li> -->
				</ul>
			</div>
			<!-- Chat message form -->
			<div class="chat-history-footer shadow-sm">
				<form class="form-send-message d-flex justify-content-between align-items-center">
					<input class="form-control message-input border-0 me-3 shadow-none"
						placeholder="Type your message here" />
					<div class="message-actions d-flex align-items-center">
						<label for="attach-doc" class="form-label mb-0">
							<i class="ti ti-photo ti-sm cursor-pointer mx-3"></i>
							<input type="file" id="attach-doc" hidden />
						</label>
						<button class="btn btn-primary d-flex send-msg-btn">
							<i class="ti ti-send me-md-1 me-0"></i>
							<span class="align-middle d-md-inline-block d-none">Send</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
import axios from '@/utils/axios';
import { useToast } from 'vue-toast-notification';
const toast = useToast();
export default {
	data() {
		return {
			id: '',
			ticket: {}
		}
	},
	mounted() {
		this.id = this.$route.params.id;
		var $this = this;
		axios.weblUrl.get(`/v1/Tickets/Tickets/Find/${this.id}`).then(function (result) {
			$this.ticket = result.data.Value;
		}).catch(function () {
			toast.error("خطای سرور")
		})
	},
}
</script>