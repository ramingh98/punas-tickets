<template>
    <div class="row g-0">
        <!-- Chat History -->
        <div id="scrollTarget" class="col app-chat-history bg-body">
            <div class="chat-history-wrapper">
                <div class="chat-history-header border-bottom">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex overflow-hidden align-items-center" style="margin-right: 15px">
                            <div class="chat-contact-info flex-grow-1 ms-2">
                                <h2 class="m-0">{{ title }}</h2>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <span v-if="status == 'درحال بررسی'" class="badge bg-label-info">
                                درحال بررسی
                            </span>
                            <span v-if="status == 'در انتظار پاسخ'" class="badge bg-label-info">
                                در انتظار پاسخ
                            </span>
                            <span v-if="status == 'پاسخ داده شد'" class="badge bg-label-success">
                                پاسخ داده شد
                            </span>
                            <span v-if="status == 'بسته شد'" class="badge bg-label-danger">
                                بسته شد
                            </span>
                            <button v-if="status == 'در انتظار پاسخ'" @click="SetAsInProgress(id)"
                                :style="{ 'margin-right': '5px' }" type="button"
                                class="btn rounded-pill btn-danger waves-effect waves-light m-2">تنظیم به عنوان در حال بررسی
                                است</button>
                            <div v-if="userName == referredUserName">
                                <button data-bs-toggle="modal" data-bs-target="#referredMessage" type="button"
                                    class="btn rounded-pill btn-success waves-effect waves-light m-2">توضیحات ارجاع</button>
                            </div>
                        </div>
                    </div>
                </div>
                <loader v-if="loading" />
                <div class="chat-history-body bg-body">
                    <ul class="list-unstyled chat-history">
                        <div class="chat-history-body bg-body">
                            <ul class="list-unstyled chat-history">
                                <div class="mt-4" v-for="(item, index) in ticket" :key="index">
                                    <li v-if="item.SupporterId != null" class="chat-message chat-message-right"
                                        style="text-align: right">
                                        <div class="d-flex overflow-hidden">
                                            <div class="chat-message-wrapper flex-grow-1 w-50">
                                                <div class="chat-message-text"
                                                    style=" background-color: #75e6da !important; width: fit-content; border-radius: 5px; padding: 9px;">
                                                    <p class="mb-0" v-html="item.Message" style="color: #05445e"></p>
                                                    <hr v-if="item.Attachments.length > 0" style="color: #05445e" />
                                                    <div v-for="(attachedFile, fileIndex) in item.Attachments"
                                                        :key="fileIndex">
                                                        <a target="blank" :href="attachedFile.FilePath"
                                                            style="color: #575b58">دانلود پیوست {{ (fileIndex += 1) }}</a>
                                                    </div>
                                                </div>
                                                <div class="text-muted mt-1" style="text-align: right">
                                                    <small v-text="item.RegDateTime"></small>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li v-else class="chat-message" style="text-align: left">
                                        <div class="d-flex overflow-hidden">
                                            <div class="chat-message-wrapper flex-grow-1 w-50">
                                                <div class="chat-message-text chat-background" style="text-align: right">
                                                    <p class="mb-0" v-html="item.Message" style="color: #05445e"></p>
                                                    <hr v-if="item.Attachments.length > 0" style="color: #05445e" />
                                                    <div v-for="(attachedFile, fileIndex) in item.Attachments"
                                                        :key="fileIndex">
                                                        <a target="blank" :href="attachedFile.FilePath"
                                                            style="color: #2f5233">دانلود پیوست {{
                                                                (fileIndex += 1) }}</a>
                                                    </div>
                                                </div>
                                                <div class="text-muted mt-1">
                                                    <small v-text="item.RegDateTime"></small>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </div>
                            </ul>
                        </div>
                    </ul>
                </div>
                <!-- Chat message form -->
                <div class="chat-history-footer shadow-sm">
                    <Form @submit="sendMessage" class="form-send-message d-flex justify-content-between align-items-center">
                        <div style="width: 100%; color: black; direction: rtl;border-radius: 200px;">
                            <div id="editor">
                            </div>
                        </div>
                        <div class="row">
                            <div class="message-actions d-flex align-items-center">
                                <label for="attach-doc" class="form-label mb-0">
                                    <i class="ti ti-photo ti-sm cursor-pointer mx-3"></i>
                                    <input ref="fileInput" type="file" id="attach-doc" hidden multiple="multiple"
                                        @change="handleFileChange" />
                                </label>
                                <button id="BtnSend" class="btn btn-primary send-msg-btn" style="margin-left: 15px">
                                    <i class="ti ti-send me-md-1 me-0"></i>
                                    <span class="align-middle d-md-inline-block d-none">ارسال</span>
                                </button>

                            </div>
                            <button type="button" v-if="urls.length > 0" @click="deleteAttachments"
                                class="btn btn-danger send-msg-btn col-1">
                                <i class="ti ti-x me-md-1 me-0"></i>
                                <span class="align-middle d-md-inline-block d-none" style="font-size: 13px">حذف پیوست
                                    ها</span>
                            </button>
                        </div>
                    </Form>
                    <p style="font-size: 20px">پسوند تصاویر ارسالی باید JPG و PNG باشد</p>
                </div>
                <div v-if="referredUserName == 'Null'">
                    <div v-if="userName == 'نوید ارفعی'">
                        <button @click="getUsers" data-bs-toggle="modal" data-bs-target="#basicModal" type="button"
                            class="btn rounded-pill btn-success waves-effect waves-light m-2">ارجاع به پشتیانی
                            مربوطه</button>
                    </div>
                </div>
                <div v-if="referredUserName != 'Null'">
                    ارجاع داده شده به {{ referredUserName }}
                    <button v-if="userName == 'نوید ارفعی'" @click="getUsers" data-bs-toggle="modal"
                        data-bs-target="#basicModal" type="button"
                        class="btn rounded-pill btn-info waves-effect waves-light m-2">ویرایش</button>
                </div>
            </div>
        </div>
        <div class="modal fade" id="basicModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel1">ارجاع تیکت به پشتیبانی مربوطه</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <Form @submit="ReferredTo()">
                        <div class="modal-body">
                            <div class="row">
                                <div class="col mb-3">
                                    <label for="nameBasic" class="form-label">کاربر</label>
                                    <select class="form-control" v-model="userId">
                                        <option v-for="item in users" v-bind:value="item.Value">{{ item.Text }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col mb-3">
                                    <label for="nameBasic" class="form-label">متن پیام</label>
                                    <Field :validate-on-input="true" v-model="referredMessage" as="textarea"
                                        name="referredMessage" :rules="validateReferredMessage" class="form-control" />
                                    <ErrorMessage name="referredMessage" />
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
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
        <div class="modal fade" id="referredMessage" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel1">ارجاع تیکت به پشتیبانی مربوطه</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>
                            {{ referredMessage }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "@/utils/axios";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useToast } from "vue-toast-notification";
import loader from "@/components/Loader.vue";
import swal from "sweetalert";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const toast = useToast();

export default {
    data() {
        return {
            id: "",
            ticket: {},
            message: "",
            title: "",
            status: "",
            read: "",
            fileInput: [],
            urls: [],
            users: [],
            referredMessage: "",
            referredUserName: "",
            userId: null,
            loading: false,
            editor: ClassicEditor,
            editorData: '',
            adminId: null,
        };
    },
    components: {
        Form, Field, ErrorMessage, loader,
    },
    mounted() {
        console.log();
        this.getMessages();
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
        this.getId()
    },
    computed: {
        userName() {
            return this.$store.state.adminName;
        },
    },
    created() {
        // در اینجا می‌توانید از اکشنی که نام کاربر را از API دریافت می‌کند فراخوانی کنید
        this.$store.dispatch('getAdminName');
    },
    methods: {
        scrollTop() {
            window.location.href = "#BtnSend";
        },
        handleFileChange(e) {
            const self = this;
            self.urls = [];
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
                toast.success(`${self.urls.length} عکس انتخاب شد`, {
                    // override the global option
                    position: "top",
                });
            }, 1000);
        },
        ReferredTo: function () {
            var $this = this;
            $this.loading = true;
            axios.panelUrl.post(`/v1/Tickets/Ticket/ReferredTo`, {
                "TicketId": $this.id,
                "UserId": $this.userId,
                "ReferredMessage": $this.referredMessage
            }).then(function (result) {
                $this.getMessages();
                toast.success('پیام به پشتیبانی مربوطه ارجاع گردید');
                $('#basicModal').modal('hide');
            }).catch(function (result) {
                toast.error("خطای سرور", {
                    // override the global option
                    position: "top",
                });
                $this.loading = false;
            });
        },
        getId: function () {
            var $this = this;

            axios.panelUrl.get(`/v1/Identities/User/GetId`).then(function (result) {
                $this.adminId = result.data.Value;
            }).catch(function (result) {
                toast.error("خطای سرور", {
                    // override the global option
                    position: "top",
                });
                $this.loading = false;
            });
        },
        getUsers: function () {
            var $this = this;
            $this.loading = true;
            $this.users = [];
            axios.panelUrl.get(`/v1/Identities/User/ReadForComboBox`).then(function (result) {
                $this.loading = false;
                $this.users = result.data.Value;
                $this.userId = result.data.Value[0].Value;
            }).catch(function (result) {
                toast.error("خطای سرور", {
                    // override the global option
                    position: "top",
                });
                $this.loading = false;
            });
        },
        getMessages: function () {
            this.id = this.$route.params.id;
            var $this = this;
            $this.loading = true;
            axios.panelUrl.get(`/v1/Tickets/Ticket/Find/${this.id}`).then(function (result) {
                console.log(result.data);
                $this.ticket = result.data.Value.CustomerTickets;
                $this.title = result.data.Value.Title;
                $this.referredMessage = result.data.Value.ReferredMessage;
                $this.referredUserName = result.data.Value.ReferredUserName;
                $this.status = result.data.Value.Status;
                $this.read = result.data.Value.Read;
                $this.loading = false;
                $this.scrollTop();
            }).catch(function (result) {
                toast.error("خطای سرور", {
                    // override the global option
                    position: "top",
                });
                $this.loading = false;
            });
        },
        sendMessage: function () {
            var $this = this;
            $this.loading = true;
            const data = editor.getData();
            axios.panelUrl.post("/v1/Tickets/Ticket/AddTicketByUser", {
                Title: $this.title,
                TicketId: $this.id,
                Message: data,
                FlutterDelta: "-----",
                SupporterId: null,
                Rate: null,
                TicketAttachments: $this.urls,
            }).then(function (result) {
                toast.success("پیام ارسال شد");
                $this.message = "";
                $this.getMessages();
                editor.setData("<p></p>");
                $this.urls = [];
                $this.loading = false;
            }).catch(function (result) {
                $this.loading = false;
                toast.error(result.response.data.Message, {
                    // override the global option
                    position: "top",
                });
            });
        },
        SetAsInProgress: function (id) {
            var $this = this;
            swal({
                title: "توجه!",
                text: "آیا از تغییر دادن وضعیت تیکت مطمئن هستید؟",
                icon: "warning",
                dangerMode: false,
                buttons: { confirm: 'بله', cancel: 'انصراف' },
                className: 'align'
            }).then((isConfirmed) => {
                if (isConfirmed) {
                    $this.loading = true;
                    axios.panelUrl.post(`/v1/Tickets/Ticket/SetAsInProgress/${id}`).then(function (result) {
                        $this.getMessages();
                        $this.loading = false;
                        swal({
                            title: "عملیات موفق",
                            text: "وضعیت تیکت تغییر داده شد"
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
        deleteAttachments: function () {
            var $this = this;
            swal({
                title: "توجه !",
                text: "آیا از حذف تصاویر انتخاب شده مطمئن هستید؟",
                icon: "warning",
                dangerMode: true,
                buttons: {
                    confirm: "بله",
                    cancel: "انصراف",
                },
                className: "align",
            }).then((isConfirmed) => {
                if (isConfirmed) {
                    $this.urls = [];
                    swal({
                        title: "عملیات موفق",
                        text: "تصاویر حذف شدند",
                        buttons: "حله",
                    });
                }
            });
        },
        validateMessage: function (message) {
            if (message == null || message == "" || message.trim() == false) {
                return "متن پیام الزامیست";
            }
            return true;
        },
        validateReferredMessage: function (message) {
            if (message == null || message == "" || message.trim() == false) {
                return "متن پیام الزامیست";
            }
            return true;
        }
    },
};
</script>
<style scoped>
.chat-background {
    color: black !important;
    display: inline-block;
    background-color: #d4f1f4;
    padding: 10px;
    border-radius: 5px;
}
</style>
