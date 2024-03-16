/* eslint-disable no-irregular-whitespace */
const fitbitContent = [
    {
        dateTime: "07/08/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/09/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/10/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/11/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/12/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/13/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/14/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/15/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/16/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/17/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/18/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/19/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/20/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/21/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/22/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/23/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/24/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/25/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/26/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/27/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/28/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/29/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/30/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "07/31/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "08/01/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "08/02/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "08/03/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "08/04/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "08/05/19 00:00:00",
        value: "0",
    },
    {
        dateTime: "08/06/19 00:00:00",
        value: "0",
    },
];

const appleWatchContent = `<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:hl7-org:v3 ../../../CDA%20R2/cda-schemas-and-samples/infrastructure/cda/CDA.xsd" xmlns="urn:hl7-org:v3" xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:l7-org:sdtc" xmlns:fhir="http://hl7.org/fhir/v3">
 <realmCode code="US"/>
 <typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>
 <templateId root="2.16.840.1.113883.10.20.22.1.2"/>
 <id extension="Health Export CDA" root="1.1.1.1.1.1.1.1.1"/>
 <code codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC" code="34109-9" displayName="Note"/>
 <title>Health Data Export</title>
 <effectiveTime value="20190905124438-0230"/>
 <confidentialityCode code="N" codeSystem="2.16.840.1.113883.5.25"/>
 <recordTarget>
  <patientRole>
   <id root="2.16.840.1.113883.4.6" nullFlavor="NA"/>
   <patient>
    <birthTime value=""/>
   </patient>
  </patientRole>
 </recordTarget>
 <entry typeCode="DRIV">
  <organizer classCode="CLUSTER" moodCode="EVN">
   <templateId root="2.16.840.1.113883.10.20.22.4.26"/>
   <id root="c6f88320-67ad-11db-bd13-0800200c9a66"/>
   <code code="46680005" codeSystem="2.16.840.1.113883.6.96" codeSystemName="SNOMED CT" displayName="Vital signs"/>
   <statusCode code="completed"/>
   <effectiveTime>
    <low value="20190827185844-0230"/>
    <high value="20190829214351-0230"/>
   </effectiveTime>
   <component>
    <observation classCode="OBS" moodCode="EVN">
     <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
     <id root="c6f88321-67ad-11db-bd13-0800200c9a66"/>
     <code code="8867-4" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC" displayName="Heart rate"/>
     <text>
      <sourceName>Daniel’s Apple Watch</sourceName>
      <sourceVersion>5.1.1</sourceVersion>
      <device>&lt;&lt;HKDevice: 0x283c21950&gt;, name:Apple Watch, manufacturer:Apple, model:Watch, hardware:Watch2,4, software:5.1.1&gt;</device>
      <value>82</value>
      <type>HKQuantityTypeIdentifierHeartRate</type>
      <unit>count/min</unit>
      <metadataEntry>
       <key>HKMetadataKeyHeartRateMotionContext</key>
       <value>0</value>
      </metadataEntry>
     </text>
     <statusCode code="completed"/>
     <effectiveTime>
      <low value="20190827185844-0230"/>
      <high value="20190827185844-0230"/>
     </effectiveTime>
     <value xsi:type="PQ" value="82" unit="count/min"/>
     <interpretationCode code="N" codeSystem="2.16.840.1.113883.5.83"/>
    </observation>
   </component>
   <component>
    <observation classCode="OBS" moodCode="EVN">
     <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
     <id root="c6f88321-67ad-11db-bd13-0800200c9a66"/>
     <code code="8867-4" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC" displayName="Heart rate"/>
     <text>
      <sourceName>Daniel’s Apple Watch</sourceName>
      <sourceVersion>5.1.1</sourceVersion>
      <device>&lt;&lt;HKDevice: 0x283c21f40&gt;, name:Apple Watch, manufacturer:Apple, model:Watch, hardware:Watch2,4, software:5.1.1&gt;</device>
      <value>85</value>
      <type>HKQuantityTypeIdentifierHeartRate</type>
      <unit>count/min</unit>
      <metadataEntry>
       <key>HKMetadataKeyHeartRateMotionContext</key>
       <value>1</value>
      </metadataEntry>
     </text>
     <statusCode code="completed"/>
     <effectiveTime>
      <low value="20190827191617-0230"/>
      <high value="20190827191617-0230"/>
     </effectiveTime>
     <value xsi:type="PQ" value="85" unit="count/min"/>
     <interpretationCode code="N" codeSystem="2.16.840.1.113883.5.83"/>
    </observation>
   </component>
  </organizer>
 </entry>
</ClinicalDocument>`;

const appleWatchData = Buffer.from(appleWatchContent);
const fitbitData = Buffer.from(JSON.stringify(fitbitContent));

export { fitbitData, appleWatchData };
