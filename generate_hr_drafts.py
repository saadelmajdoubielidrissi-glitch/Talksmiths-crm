import urllib.parse

contacts = [
    ("Atos Morocco", "Ibrahim", "ibrahim.filali@atos.net", "Coaching en anglais executif pour le management d'Atos Maroc", """Bonjour Ibrahim,

En tant que DRH d'Atos Maroc, vous savez que l'excellence technique de vos equipes est reconnue. Cependant, avec l'exposition croissante du centre de services aux clients US/UK, un defi majeur emerge : la capacite de vos managers d'operations a porter la voix du Maroc avec autorite lors des comites de pilotage anglophones.

Talksmiths propose un coaching intensif en anglais des affaires, exclusivement concu pour les cadres. Nous travaillons la posture et le vocabulaire d'influence pour rassurer vos clients internationaux.

Seriez-vous ouvert a en discuter brievement la semaine prochaine ?

Cordialement,
Saad El Majdoubi"""),
    ("Sopra Banking", "Imane", "imane.mguired@soprabanking.com", "Developpement des competences en communication globale chez SBS", """Bonjour Imane,

Felicitations pour le dynamisme de Sopra Banking au Maroc. Dans un contexte de delivery global, l'aisance de vos leaders techniques face aux stakeholders anglophones est un levier de retention client critique.

Nous accompagnons les DRH dans l'acceleration de la posture executive en anglais de leurs hauts potentiels. Contrairement aux formations classiques, Talksmiths se concentre sur la rhetorique business et la negociation en anglais.

Pourrions-nous echanger 10 minutes sur vos priorites L&D pour 2026 ?

Cordialement,
Saad El Majdoubi"""),
    ("xHub", "Yassine", "yassine@xhub.ma", "L'anglais Leadership pour les experts de xHub", """Bonjour Yassine,

Bravo pour le succes continu de xHub et son rayonnement technologique. Pour une structure d'excellence comme la votre, l'expansion sur les marches US/UK demande que vos Tech Leads ne soient plus seulement des experts, mais des ambassadeurs capables de pitcher des architectures complexes en anglais avec brio.

Talksmiths coach le top management tech sur l'anglais d'influence. Nous travaillons la stature pour que vos equipes imposent le respect lors de chaque interaction internationale.

Disponible pour un court echange la semaine prochaine ?

Cordialement,
Saad El Majdoubi"""),
    ("DXC Technology", "Anass", "anass.lhachimi@dxc.com", "Optimisation de la posture anglophone des managers DXC", """Bonjour Anass,

Au sein du hub DXC Maroc, la performance operationnelle est indissociable de la qualite de la communication avec les sites globaux. Le gap n'est souvent pas le niveau d'anglais, mais la capacite des managers a defendre leurs KPIs en anglais avec la meme precision qu'en francais.

Talksmiths propose un coaching en leadership communication en anglais pour vos Site Managers et Operations Leads.

Auriez-vous une disponibilite pour un rapide tour d'horizon ?

Cordialement,
Saad El Majdoubi"""),
    ("NTT Data Morocco", "Sanaa", "sanaa.essaady@nttdata.com", "Executive English Coaching pour NTT Data Maroc", """Bonjour Sanaa,

Avec la consolidation One NTT, vos leaders locaux sont en premiere ligne face a une gouvernance de plus en plus anglophone. Reduire les frictions de communication a ce niveau est un gain d'efficacite immediat pour vos operations.

Notre cabinet Talksmiths intervient exclusivement sur le coaching en anglais des affaires pour cadres dirigeants, en mettant l'accent sur la force de conviction.

Seriez-vous ouverte a une brieve presentation de notre approche ?

Cordialement,
Saad El Majdoubi"""),
    ("SAP Morocco", "Mourad", "mourad.eliklil@sap.com", "SAP Morocco : Rhetorique executive en anglais pour vos Solution Architects", """Bonjour Mourad,

Les experts SAP au Maroc sont au coeur des transformations digitales regionales. Pour accompagner cette montee en puissance, la maitrise de la communication strategique en anglais est primordiale, tant pour rassurer les clients que pour collaborer avec SAP Global.

Talksmiths aide vos leaders a maitriser les codes de la communication executive anglophone.

Un echange rapide la semaine prochaine serait-il pertinent pour vous ?

Cordialement,
Saad El Majdoubi"""),
    ("Oracle Morocco", "Leila", "leila.elalmi@oracle.com", "Leadership Communication en Anglais pour Oracle North Africa", """Bonjour Leila,

Dans votre role de direction RH, vous identifiez certainement l'agilite linguistique comme un vecteur de croissance majeur pour vos equipes Cloud et Consulting. Pitcher une infrastructure OCI en anglais face a des VP Engineering globaux exige une posture specifique.

Nous coachons les cadres superieurs d'Oracle sur ces competences de haut niveau (negociation, influence, leadership) en anglais.

Disponible pour en discuter brievement ?

Cordialement,
Saad El Majdoubi"""),
    ("Microsoft Morocco", "Fatiha", "fatiha.ahriche@microsoft.com", "Microsoft Maroc : Coaching d'influence en anglais pour le management", """Bonjour Fatiha,

A l'heure ou Microsoft Maroc drive l'innovation IA dans la region, l'exposition internationale de vos managers est totale. Savoir articuler des visions strategiques complexes en anglais avec l'assurance attendue par Redmond est un defi permanent.

Talksmiths propose un accompagnement sur mesure pour vos hauts potentiels en anglais executive.

Quand auriez-vous 10 minutes pour explorer comment nous pourrions soutenir vos equipes ?

Cordialement,
Saad El Majdoubi"""),
    ("Nuitee", "Mohamed", "mohamed@nuitee.com", "Nuitee : Scalabilite et Leadership anglophone", """Bonjour Mohamed,

Felicitations pour le parcours de Nuitee. En tant que fondateur, vous savez qu'une scale-up travel-tech agile doit avoir des leaders capables de negocier avec des distributeurs mondiaux en anglais sans aucune hesitation.

Talksmiths aide vos Product Owners et Tech Leads a acquerir la stature et la repartie necessaires face aux acteurs US/UK.

Seriez-vous ouvert a un bref echange pour voir comment booster la force d'influence de votre equipe ?

Cordialement,
Saad El Majdoubi"""),
    ("Centific / Pactera", "Hanane", "hanane.belmahi@centific.com", "Posture anglophone et delivery IA chez Centific Maroc", """Bonjour Hanane,

La reussite de Centific (ex-Pactera EDGE) au Maroc repose sur la qualite de votre delivery IA pour des clients globaux. Pour vos Site Leads, savoir rassurer un client de la Silicon Valley en anglais au-dela des rapports metriques est la cle du renouvellement de contrats.

Nous coachons vos managers sur l'anglais de direction pour renforcer leur leadership percu a l'international.

Pourrions-nous en discuter lors d'un court call ?

Cordialement,
Saad El Majdoubi""")
]

html = "<html><body><h1>Batch 2 HR/L&D Drafts</h1>"
for company, name, email, subject, body in contacts:
    # URL encode
    encoded_subject = urllib.parse.quote(subject)
    encoded_body = urllib.parse.quote(body)
    url = f"https://mail.google.com/mail/?authuser=saad.elmajdoubi@talksmiths.net&view=cm&fs=1&to={email}&su={encoded_subject}&body={encoded_body}"
    html += f'<p><strong>{company}</strong>: <a href="{url}" target="_blank">Create Draft for {name} ({email})</a></p>'

html += "</body></html>"

with open("c:/Users/Saad El Majdoubi/Talksmiths/hr_drafts.html", "w") as f:
    f.write(html)
