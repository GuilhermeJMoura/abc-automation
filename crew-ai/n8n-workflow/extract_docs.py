import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

core_nodes = [
    "activationtrigger",
    "aggregate",
    "aitransform",
    "code",
    "comparedatasets",
    "compression",
    "chattrigger",
    "converttofile",
    "crypto",
    "datetime",
    "debughelper",
    "editfields",
    "editimage",
    "emailtriggerimap",
    "errortrigger",
    "evaluationtrigger",
    "executecommand",
    "executesubworkflow",
    "executesubworkflowtrigger",
    "executiondata",
    "extractfromfile",
    "filter",
    "ftp",
    "git",
    "graphql",
    "html",
    "httprequest",
    "if",
    "jwt",
    "ldap",
    "limit",
    "localfiletrigger",
    "loopoveritemssplitinbatches",
    "manualtrigger",
    "markdown",
    "mcpservertrigger",
    "merge",
    "n8n",
    "n8nform",
    "n8nformtrigger",
    "n8ntrigger",
    "noop",
    "readwritefilesfromdisk",
    "removeduplicates",
    "renamekeys",
    "respondtowebhook",
    "rssread",
    "rssfeedtrigger",
    "scheduletrigger",
    "sendemail",
    "sort",
    "splitout",
    "ssetrigger",
    "ssh",
    "stopanderror",
    "summarize",
    "switch",
    "totp",
    "wait",
    "webhook",
    "workflowtrigger",
    "xml"
]

base_url = "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base."
urls = [f"{base_url}{slug}/" for slug in core_nodes]


# # Lista de URLs dos nodes do n8n
# urls = [
#     ttps://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.aitransform
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.amazons3
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.amazonsns
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.amazonsqs
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.appendandmerge
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.awslambda
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.awss3
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.awssns
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.awssqs
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.azureblobstorage
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.azureeventgrid
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.azurefiles
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.azurequeuestorage
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.azureservicebus
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.brevo
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.calcom
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.calendly
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.chargebee
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.chartmogul
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.chatwoot
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.clearbit
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.clockify
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.comparedatasets
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.compression
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.converttofile
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.copper
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.crypto
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.customerio
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.datetime
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.debughelper
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.deepgram
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.deepl
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.discord
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.editfields
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.editimage
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.email
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.errortrigger
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.evaluation
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executecommand
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflow
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.facebookfeed
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.facebookleadads
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.facebookmarketing
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.flowise
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.freshdesk
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.freshsales
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.freshservice
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.function
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.functionitem
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.getresponse
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.github
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.gitlab
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.gmail
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.gohighlevel
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.googleads
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.googleanalytics
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.googlecalendar
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.googlecloudstorage
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.googlecontacts
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.googledrive
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.googleforms
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.googlemaps
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.googlesheets
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.googletagmanager
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.gotowebinar
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.graphql
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.harvest
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.hubspot
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.humanity
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.intercom
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.itemlists
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.jira
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.keap
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.linkedin
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.mailchimp
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.mailerlite
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.mailgun
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.mattermost
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.microsoftdynamics365crm
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.microsoftexcel
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.microsoftonedrive
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.microsoftoutlook
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.microsoftsharepoint
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.microsoftsql
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.microsoftteams
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.mondaycom
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.mongodb
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.moosend
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.movebinarydata
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.msg91
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.mysql
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.activationtrigger
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.aggregate
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.chattrigger
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.code
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.comparedatasets
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.compression
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.converttofile
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.crypto
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.datetime
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.debughelper
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.editfields
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.editimage
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.emailtrigger
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.errortrigger
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.evaluation
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.evaluationtrigger
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.executecommand
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.executeworkflow
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.function
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.functionitem
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.httprequest
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.if
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.itemlists
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.merge
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.movebinarydata
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.nocode
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.noop
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.readbinaryfile
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.readbinaryfiles
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n-nodes-base.removeduplicates
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduleeverycron
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduleeveryday
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduleeveryhour
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduleeveryminute
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduleeverymonth
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduleeveryweek
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduleeveryyear
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitinbatches
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.spreadsheetfile
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.start
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.writebinaryfile
# https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.xml,
# ]

# Nome do arquivo markdown de saída
output_file = "n8n_nodes_docs.md"

with open(output_file, "w", encoding="utf-8") as f:
    for url in urls:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        # Extração do título da página
        title = soup.find("h1").get_text(strip=True)
        f.write(f"# {title}\n\n")

        # Extração do conteúdo principal
        main_content = soup.find("main")  # ou outro container principal

        if main_content:
            markdown = md(str(main_content))
            f.write(markdown)
            f.write("\n\n---\n\n")  # separador entre documentos
        else:
            f.write("_Conteúdo principal não encontrado._\n\n")
