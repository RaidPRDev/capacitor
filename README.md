# capacitor

Staging App ID
com.sweetrush.staging.elso

Production App ID
com.sweetrush.elso


# Docker
docker build -t elso-app .
docker run -it -p 8080:8080 --rm --name elso-app-production elso-app
or run dev.sh script


# json data link example
<a href='#' data-link='CHECKLIST##ELSOBA_CHKLST_160' target='_self'>Membrane Lung Failure checklist</a>