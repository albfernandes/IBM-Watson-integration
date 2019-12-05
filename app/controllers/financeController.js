const financeController = module.exports = {};
const financeapp = require('../services/finance/financeapp');
const jwtapp = require('../authentication/auth');
const Sentry = require('@sentry/node');
const dateFormat = require('dateformat');
Sentry.init({ dsn: require('../config/general.config').sentry_dsn });

const msg = {
    0: "Não",
    1: "Sim"
};

financeController.listinvoices = async function(req, res){
    try{
        const {companyId} = req.body;

        let token = jwtapp.generateToken({
            "iss": "",
            "aud": "",
            "iat": '',
            "exp": '',
            "jti": "1",
            "companyId": companyId
        });

        let params = {
            method: 'GET',
            endpoint: '',
            token: token
        };

        let invoices = await financeapp.getInfo(params, "");
        invoices = JSON.parse(invoices);

        let response = '';

        await Promise.all(invoices.map(async invoice => {
            const { status } = invoice;
            if(status !== "pending"){
                let invoiceDetail = await financeapp.getInfo(params, invoice.id);
                invoiceDetail = JSON.parse(invoiceDetail);
                let dateBr = dateFormat(new Date(invoiceDetail.due), 'dd/mm/yyyy');

                response += `${dateBr}\n ${invoiceDetail.url} \n\n`;
            }
        }));

        return res.status(200).json({
            variables: {
                billets: response === '' ? 'false' : response
            }
        });

    }catch(e) {
        Sentry.captureEvent(e);
        return res.status(400).json({msg: `Finance service invoices error: ${e}`});
    }
};

financeController.subcriptionInfo = async function(req, res){
    try {
        const {companyId} = req.body;

        let token = jwtapp.generateToken({
            "iss": "",
            "aud": "",
            "iat": '',
            "exp": '',
            "jti": "1",
            "companyId": companyId
        });

        let params = {
            method: 'GET',
            endpoint: '',
            token: token
        };

        let subscription = await financeapp.getInfo(params, "");
        subscription = JSON.parse(subscription);

        let response = {
            id: subscription.id,
            package: subscription.package,
            agent: subscription.agent,
            aditional_agent: subscription.aditional_agent,
            whatsapp: subscription.whatsapp,
            custom: subscription.custom,
            suspended: subscription.suspended,
            cycle: subscription.cycle,
            period_end: subscription.period_end,
            coupon: subscription.coupon,
            subtotal: subscription.subtotal,
            discount: subscription.discount,
            total: subscription.total,
            limits_id: subscription.limits.id,
            limits_company_id: subscription.limits.company_id,
            limits_user: subscription.limits.user,
            limits_virtual_agent: subscription.limits.virtual_agent,
            limits_worktime: subscription.limits.worktime,
            limits_mobile_app: subscription.limits.mobile_app,
            limits_multicompany: subscription.limits.multicompany,
            limits_holiday: subscription.limits.holiday,
            limits_whitelabel: subscription.limits.whitelabel,
            limits_segment: subscription.limits.segment,
            limits_contact: subscription.limits.contact,
            limits_organization: subscription.limits.organization,
            limits_timeline: subscription.limits.timeline,
            limits_block_contact: subscription.limits.block_contact,
            limits_contact_owner: subscription.limits.contact_owner,
            limits_custom_field: subscription.limits.custom_field,
            limits_workflow: subscription.limits.workflow,
            limits_agent_conected: subscription.limits.agent_conected,
            limits_shortcut: subscription.limits.shortcut,
            limits_status: subscription.limits.status,
            limits_spy_chat: subscription.limits.spy_chat,
            limits_leads_live: subscription.limits.leads_live,
            limits_attendance_queue: msg[subscription.limits.attendance_queue],
            limits_archived_chat: subscription.limits.archived_chat,
            limits_internal_chat: subscription.limits.internal_chat,
            limits_transfer_attendance: subscription.limits.transfer_attendance,
            limits_group_attendance: subscription.limits.group_attendance,
            limits_type_magic: subscription.limits.type_magic,
            limits_chat_transcription: subscription.limits.chat_transcription,
            limits_print_chat: subscription.limits.print_chat,
            limits_department: subscription.limits.department,
            limits_sla: subscription.limits.sla,
            limits_auto_distribution: subscription.limits.auto_distribution,
            limits_file_upload: subscription.limits.file_upload,
            limits_record_audio: subscription.limits.record_audio,
            limits_attendance_reason: subscription.limits.attendance_reason,
            limits_switch_channel: subscription.limits.switch_channel,
            limits_internal_note: subscription.limits.internal_note,
            limits_custom_view: subscription.limits.custom_view,
            limits_action: subscription.limits.action,
            limits_flow_console: subscription.limits.flow_console,
            limits_attendance_history: subscription.limits.attendance_history,
            limits_automator: subscription.limits.automator,
            limits_omnichannel: subscription.limits.omnichannel,
            limits_bot: subscription.limits.bot,
            limits_flow: subscription.limits.flow,
            limits_export_flow: subscription.limits.export_flow,
            limits_out_flow: subscription.limits.out_flow,
            limits_in_flow: subscription.limits.in_flow,
            limits_master_flow: subscription.limits.master_flow,
            limits_import_flow: subscription.limits.import_flow,
            limits_trigger: subscription.limits.trigger,
            limits_report: subscription.limits.report,
            limits_dashboard: msg[subscription.limits.dashboard],
            limits_base: subscription.limits.base,
            limits_export_csv: subscription.limits.export_csv,
            limits_api_call: subscription.limits.api_call,
            limits_webhook: subscription.limits.webhook,
            limits_app: subscription.limits.app,
            limits_web_sdk: subscription.limits.web_sdk,
            limits_mobile_sdk: subscription.limits.mobile_sdk,
            limits_chat: subscription.limits.chat,
            limits_telegram: subscription.limits.telegram,
            limits_messenger: subscription.limits.messenger,
            limits_email: subscription.limits.email,
            limits_whatsapp: subscription.limits.whatsapp,
            limits_voip: subscription.limits.voip,
            limits_video_conference: subscription.limits.video_conference,
            limits_sms: subscription.limits.sms,
            limits_custom_channel: subscription.limits.custom_channel,
            limits_account_manager: subscription.limits.account_manager,
            limits_help_center: subscription.limits.help_center,
            limits_support_sms_email: subscription.limits.support_sms_email,
            limits_support_phone: subscription.limits.support_phone,
            limits_setup: subscription.limits.setup,
            limits_integration_setup: subscription.limits.integration_setup,
            limits_flow_creation_help: subscription.limits.flow_creation_help,
            limits_advanced_trainning: subscription.limits.advanced_trainning,
            limits_worktime_support: subscription.limits.worktime_support,
            limits_support_24h: subscription.limits.support_24h,
            limits_quarterly_monitoring: subscription.limits.quarterly_monitoring,
            limits_monthly_monitoring: subscription.limits.monthly_monitoring,
            limits_ip_access_control: subscription.limits.ip_access_control,
            limits_single_signon: subscription.limits.single_signon,
            limits_two_steps_login: subscription.limits.two_steps_login,
            limits_login_scale: subscription.limits.login_scale,
            limits_custom_access_profile: subscription.limits.custom_access_profile,
            limits_general_access_profile: subscription.limits.general_access_profile,
            limits_created_at: subscription.limits.created_at,
            limits_updated_at: subscription.limits.updated_at,
            limits_deleted_at: subscription.limits.deleted_at
        };

        if(subscription.hasOwnProperty('items')){
            if(subscription.items.hasOwnProperty('plan')){
                response = Object.assign(response, {
                    items_plan_quantity: subscription.items.plan.quantity,
                    items_plan_description: subscription.items.plan.description,
                    items_plan_price: subscription.items.plan.price
                })
            }
            if(subscription.items.hasOwnProperty('aditional_agent')){
                response = Object.assign(response, {
                    items_aditional_agent_quantity: subscription.items.aditional_agent.quantity,
                    items_aditional_agent_description: subscription.items.aditional_agent.description,
                    items_aditional_agent_price: subscription.items.aditional_agent.price
                })
            }
            if(subscription.items.hasOwnProperty('whatsapp')){
                response = Object.assign(response, {
                    items_whatsapp_quantity: subscription.items.whatsapp.quantity,
                    items_whatsapp_description: subscription.items.whatsapp.description,
                    items_whatsapp_price: subscription.items.whatsapp.price
                })
            }
        }

        return res.status(200).json({
            variables: response
        });

    }catch (e) {
        Sentry.captureEvent(e);
        return res.status(400).json({msg: `Finance service subscription error: ${e}`});
    }
};
