\# Gestión de Afiliaciones — Brief V1



\## Objetivo general



Quiero agregar al proyecto actual un nuevo módulo llamado \*\*Gestión de Afiliaciones\*\*.



Este módulo debe pensarse como una aplicación independiente en esta etapa, aunque más adelante pueda convivir o integrarse con otros sistemas relacionados.



La idea es que este módulo permita:



\* registrar personas a afiliar o en proceso

\* hacer seguimiento simple del trámite

\* controlar documentación y carga

\* vincular uno o más referentes

\* consultar listados completos y reducidos

\* gestionar un submódulo de referentes



\## Criterio técnico principal



Aunque esta primera versión puede funcionar inicialmente con datos mock o persistencia simple para pruebas, \*\*la arquitectura debe quedar preparada para conectarse luego a un backend y una base de datos en la nube\*\*.



\### Esto implica:



\* separar claramente la UI de la lógica de datos

\* no acoplar formularios o listados a `localStorage` directamente

\* no hardcodear datos dentro de componentes visuales

\* crear una capa de servicios o repositorios para acceder a los datos

\* dejar tipos/interfaces/modelos claros y reutilizables

\* facilitar futura migración a API REST, backend propio o servicio cloud



\## Alcance de esta V1



La prioridad es construir una \*\*V1 funcional, clara y escalable\*\*, con una base visual y técnica prolija desde el inicio.



No hace falta implementar todavía autenticación, backend real ni base de datos real, pero sí dejar la app preparada para eso.



\---



\## Pantallas de la V1



\### 1. Inicio del módulo



Debe mostrar:



\* resumen rápido

\* cantidad de personas en proceso

\* pendientes de DNI

\* pendientes de carga en SISAPP

\* falta armar ficha

\* accesos rápidos a:



&#x20; \* Personas

&#x20; \* Alta nueva

&#x20; \* Referentes



\### 2. Personas



Pantalla principal del módulo.



Debe tener \*\*dos vistas\*\*:



\#### Vista completa



Mostrar:



\* nombre y apellido

\* DNI

\* localidad

\* estado actual

\* referente

\* fecha del último movimiento



Permitir:



\* búsqueda por nombre y apellido o DNI

\* filtro por estado

\* filtro por localidad

\* filtro por referente

\* acceso al detalle de ficha

\* acceso a alta nueva



\#### Vista reducida



Mostrar:



\* número de orden

\* nombre y apellido

\* referente

\* aclaración breve

\* total de registros visibles



La aclaración breve debe construirse con lógica simple, por ejemplo:



\* Falta DNI

\* Falta ficha

\* Falta SISAPP

\* Sin referente

\* Completo



\### 3. Alta / edición de persona



Formulario dividido en 7 secciones:



1\. Datos personales

2\. Domicilio

3\. Estado y fechas

4\. Checklist de gestión

5\. Referentes

6\. Seguimiento / notas

7\. Adjuntos



\### 4. Detalle de ficha



Vista de lectura de una persona.



Debe mostrar:



\* datos principales

\* checklist

\* referentes vinculados

\* notas

\* links a documentación



Debe permitir:



\* editar ficha

\* abrir links

\* navegar a referentes vinculados



\### 5. Referentes



Listado general de referentes.



Debe permitir:



\* buscar

\* crear nuevo referente

\* abrir detalle de referente



\### 6. Detalle de referente



Debe mostrar:



\* nombre del referente

\* observaciones generales

\* personas vinculadas

\* rol con el que aparece en cada ficha

\* estado de cada persona



\---



\## Modelo de datos: Persona



\## 1. Datos personales



\* apellido → obligatorio → texto

\* nombre → obligatorio → texto

\* DNI → obligatorio → número

\* sexo → opcional → selector

\* fecha de nacimiento → opcional → fecha



Opciones de sexo:



\* Femenino (F)

\* Masculino (M)

\* No Binario (X)



\## 2. Domicilio



\* calle → obligatorio → texto

\* número → obligatorio → número

\* piso → opcional → texto corto

\* departamento → opcional → texto corto

\* localidad → obligatorio → selector



Opciones de localidad:



\* Luján

\* Carlos Keen

\* Jáuregui

\* Pueblo Nuevo

\* Cortínez

\* Torres

\* Open Door

\* Olivera



\## 3. Estado y fechas



\* estado → obligatorio → selector

\* fecha de alta → automática

\* fecha del último movimiento → automática

\* fecha de afiliación → opcional → fecha manual



Opciones de estado:



\* Para afiliar

\* Enviado a Justicia

\* Afiliado

\* Rechazado

\* Afiliación anterior



\## 4. Checklist de gestión



Campos tipo checkbox:



\* ficha armada

\* copia DNI

\* cargado en SISAPP

\* aparece en padrón



Además:



\* observaciones generales → texto largo



Importante: esto debe funcionar como \*\*checklist\*\*, no como pasos del trámite.



\## 5. Referentes



El bloque de referentes es \*\*opcional\*\*.



Lógica:



\* debe existir un control tipo “¿Tiene referente?”

\* si la respuesta es no, la ficha se puede guardar igual

\* si la respuesta es sí, se despliega la sección para cargar uno o más referentes



Cada referente vinculado debe tener:



\* referente → selector

\* rol → selector

\* observación → texto



Opciones de rol:



\* Principal

\* Subreferente

\* Otro



Importante:



\* una persona puede tener uno o más referentes

\* debe poder crearse un referente nuevo desde la misma ficha, sin salir del formulario



\## 6. Seguimiento / notas



\* fecha de contacto → opcional → fecha

\* notas → opcional → texto largo



\## 7. Adjuntos



En esta V1 no quiero subida real de archivos.



Quiero solo campos de texto para pegar enlaces:



\* link DNI frente

\* link DNI dorso

\* link ficha de afiliación



Todos opcionales.



\---



\## Modelo de datos: Referente



Cada referente debe tener:



\* apellido y nombre → obligatorio → texto

\* observaciones generales → opcional → texto largo



Debe existir:



\* listado de referentes

\* alta de referente

\* edición de referente

\* detalle de referente con personas vinculadas



\---



\## Reglas de negocio



\* evitar duplicados por DNI

\* fecha de alta automática al crear la ficha

\* fecha del último movimiento automática al guardar cambios

\* fecha de afiliación manual, no automática

\* el listado de personas debe tener vista completa y vista reducida

\* la vista reducida debe estar numerada y mostrar cantidad total visible

\* la lógica del panel inicial debe salir del checklist:



&#x20; \* pendientes de DNI

&#x20; \* pendientes de SISAPP

&#x20; \* falta ficha armada



\---



\## Criterios de arquitectura



La implementación debe quedar preparada para una futura conexión con backend y base de datos en la nube.



\### Requisitos de arquitectura:



\* separar componentes visuales de acceso a datos

\* centralizar operaciones CRUD en una capa propia

\* usar tipos/interfaces/modelos consistentes

\* dejar preparada la estructura para reemplazar datos mock por llamadas a API

\* evitar dependencias directas entre UI y mecanismo de persistencia

\* usar IDs únicos para personas y referentes

\* modelar correctamente la relación entre personas y referentes

\* contemplar que más adelante puede haber autenticación y usuarios



\### Sugerencia de organización



Puede resolverse con una estructura tipo:



\* `types/`

\* `services/` o `repositories/`

\* `pages/`

\* `components/`

\* `mock/` o `data/`



No es obligatorio respetar exactamente esos nombres, pero sí mantener separación clara de responsabilidades.



\---



\## Persistencia en esta etapa



Para esta V1 se puede usar:



\* datos mock

\* una capa fake de persistencia

\* almacenamiento simple temporal



Pero debe ser fácil migrar luego a:



\* API REST

\* backend propio

\* base de datos cloud



Evitar una implementación pensada exclusivamente para `localStorage`.



\---



\## Criterios de implementación visual



\* definir una identidad visual simple, clara y consistente para esta aplicación

\* priorizar mobile-first

\* componentes claros y reutilizables

\* arquitectura prolija y escalable

\* código legible

\* evitar sobreingeniería en esta V1



\---



\## Entregable esperado



Quiero que implementes esta aplicación, incluyendo:



\* nuevas pantallas

\* navegación interna del módulo

\* tipos/interfaces

\* capa de datos desacoplada de la UI

\* datos mock o persistencia simple no acoplada

\* formularios

\* filtros

\* vistas completa y reducida

\* submódulo de referentes



Si hay decisiones menores de UX o estructura que no estén especificadas, resolverlas de forma simple, consistente y pensando en una futura integración con backend real.



