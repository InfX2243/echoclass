import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, TransactWriteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client=DynamoDBDocumentClient.from(new DynamoDBClient({}));
const tableName=()=>process.env.TABLE_NAME;
const now=()=>new Date().toISOString();
const classPk=id=>`CLASS#${id}`;
const lessonPk=id=>`LESSON#${id}`;
const cleanLesson=item=>({id:item.lessonId,classId:item.classId,title:item.title,description:item.description??null,status:item.status,media:item.media??null,createdAt:item.createdAt,updatedAt:item.updatedAt,publishedAt:item.publishedAt??null});

export const createLesson=async({classId,teacherId,title,description})=>{
 const createdAt=now(),lessonId=randomUUID();
 const lesson={entityType:'LESSON',lessonId,classId,teacherId,title,description:description||undefined,status:'DRAFT',createdAt,updatedAt:createdAt};
 const classItem={PK:classPk(classId),SK:`LESSON#${createdAt}#${lessonId}`,...lesson};
 const profileItem={PK:lessonPk(lessonId),SK:'PROFILE',...lesson};
 await client.send(new TransactWriteCommand({TransactItems:[
  {Put:{TableName:tableName(),Item:classItem,ConditionExpression:'attribute_not_exists(PK) AND attribute_not_exists(SK)'}},
  {Put:{TableName:tableName(),Item:profileItem,ConditionExpression:'attribute_not_exists(PK) AND attribute_not_exists(SK)'}}
 ]}));
 return cleanLesson(profileItem);
};
export const getLessonById=async lessonId=>{const r=await client.send(new GetCommand({TableName:tableName(),Key:{PK:lessonPk(lessonId),SK:'PROFILE'}}));return r.Item?cleanLesson(r.Item):null};
export const getLessonForTeacher=async(lessonId,teacherId)=>{const l=await getLessonById(lessonId);return l&&(await ownsLesson(lessonId,teacherId))?l:null};
export const ownsLesson=async(lessonId,teacherId)=>{const r=await client.send(new GetCommand({TableName:tableName(),Key:{PK:lessonPk(lessonId),SK:'PROFILE'}}));return r.Item?.teacherId===teacherId};
export const listLessonsForClass=async({classId,publishedOnly=false})=>{const r=await client.send(new QueryCommand({TableName:tableName(),KeyConditionExpression:'PK = :pk AND begins_with(SK, :prefix)',ExpressionAttributeValues:{':pk':classPk(classId),':prefix':'LESSON#'},ScanIndexForward:false}));return(r.Items??[]).filter(i=>i.entityType==='LESSON'&&(!publishedOnly||i.status==='PUBLISHED')).map(cleanLesson)};
export const updateLesson=async({lessonId,teacherId,title,description})=>{const l=await getLessonForTeacher(lessonId,teacherId);if(!l||l.status==='ARCHIVED')return null;const values={':updatedAt':now()},updates=['updatedAt = :updatedAt'],names={};if(title!==undefined){names['#title']='title';values[':title']=title;updates.push('#title = :title')}if(description!==undefined){names['#description']='description';values[':description']=description||null;updates.push('#description = :description')}const r=await client.send(new UpdateCommand({TableName:tableName(),Key:{PK:lessonPk(lessonId),SK:'PROFILE'},UpdateExpression:`SET ${updates.join(', ')}`,ExpressionAttributeNames:Object.keys(names).length?names:undefined,ExpressionAttributeValues:values,ReturnValues:'ALL_NEW'}));await syncClassLesson(r.Attributes);return cleanLesson(r.Attributes)};
export const setLessonMedia=async({lessonId,teacherId,media})=>{const l=await getLessonForTeacher(lessonId,teacherId);if(!l||l.status==='ARCHIVED')return null;const r=await client.send(new UpdateCommand({TableName:tableName(),Key:{PK:lessonPk(lessonId),SK:'PROFILE'},UpdateExpression:'SET media = :media, updatedAt = :updatedAt',ExpressionAttributeValues:{':media':media,':updatedAt':now()},ReturnValues:'ALL_NEW'}));await syncClassLesson(r.Attributes);return cleanLesson(r.Attributes)};
const syncClassLesson=async item=>{const r=await client.send(new QueryCommand({TableName:tableName(),KeyConditionExpression:'PK = :pk AND begins_with(SK, :prefix)',ExpressionAttributeValues:{':pk':classPk(item.classId),':prefix':'LESSON#'}}));const existing=(r.Items??[]).find(c=>c.lessonId===item.lessonId);if(!existing)return;await client.send(new UpdateCommand({TableName:tableName(),Key:{PK:existing.PK,SK:existing.SK},UpdateExpression:'SET #title = :title, #description = :description, #status = :status, media = :media, updatedAt = :updatedAt, publishedAt = :publishedAt',ExpressionAttributeNames:{'#title':'title','#description':'description','#status':'status'},ExpressionAttributeValues:{':title':item.title,':description':item.description??null,':status':item.status,':media':item.media??null,':updatedAt':item.updatedAt,':publishedAt':item.publishedAt??null}}))};
export const setLessonStatus=async({lessonId,teacherId,status})=>{const l=await getLessonForTeacher(lessonId,teacherId);if(!l||(l.status==='ARCHIVED'&&status!=='ARCHIVED'))return null;const updatedAt=now(),publishedAt=status==='PUBLISHED'?(l.publishedAt??updatedAt):null;const r=await client.send(new UpdateCommand({TableName:tableName(),Key:{PK:lessonPk(lessonId),SK:'PROFILE'},UpdateExpression:'SET #status = :status, updatedAt = :updatedAt, publishedAt = :publishedAt',ExpressionAttributeNames:{'#status':'status'},ExpressionAttributeValues:{':status':status,':updatedAt':updatedAt,':publishedAt':publishedAt},ReturnValues:'ALL_NEW'}));await syncClassLesson(r.Attributes);return cleanLesson(r.Attributes)};