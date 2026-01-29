import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout.js'
import Alert from '../../components/Alert.js'
import MathDisplay from '../../components/MathDisplay.js'
import { ArrowLeft, Edit2, Save, X, Download, Trash2, FileText, Plus, ChevronDown, ChevronUp, FileDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ExportDropdown from '../../components/ExportDropdown.js'


export async function getServerSideProps(context) {
 return {
   props: {}
 }
}

export default function DocumentView({ session, loading: appLoading }) {
 const router = useRouter()
 const { id } = router.query
 const [document, setDocument] = useState(null)
 const [questions, setQuestions] = useState([])
 const [answerKey, setAnswerKey] = useState([])
 const [loading, setLoading] = useState(true)
 const [editingId, setEditingId] = useState(null)
 const [editText, setEditText] = useState('')
 const [saving, setSaving] = useState(false)
 const [deleting, setDeleting] = useState(false)
 const [alert, setAlert] = useState(null)
 const [addingQuestion, setAddingQuestion] = useState(false)
 const [newQuestionText, setNewQuestionText] = useState('')
 const [showQuestions, setShowQuestions] = useState(true)
 const [showAnswerKey, setShowAnswerKey] = useState(false)
 const [editingTitle, setEditingTitle] = useState(false)
 const [titleText, setTitleText] = useState('')


 useEffect(() => {
   if (!id) return
   fetchDocument()
 }, [id])


 const fetchDocument = async () => {
   try {
     const { data, error } = await supabase
       .from('documents')
       .select('*')
       .eq('id', id)
       .single()


     if (error) throw error


     setDocument(data)
     setTitleText(data.title || data.topic)
     parseQuestions(data.content)
     parseAnswerKey(data.answer_key)
   } catch (error) {
     console.error('Error fetching document:', error)
     setAlert({ message: 'Failed to load document', type: 'error' })
     setTimeout(() => router.push('/materials'), 2000)
   } finally {
     setLoading(false)
   }
 }


 const parseQuestions = (content) => {
   let parsedQuestions = []
   if (content) {
     try {
       const parsed = JSON.parse(content)
       if (Array.isArray(parsed)) {
         parsedQuestions = parsed
       } else if (parsed.questions && Array.isArray(parsed.questions)) {
         parsedQuestions = parsed.questions
       }
     } catch (e) {
       parsedQuestions = content.split(/\n(?=Question|\d+\.|Q:)/).map((q, i) => ({
         id: i,
         text: q.trim(),
       }))
     }
   }
  
   setQuestions(
     parsedQuestions.map((q, i) => ({
       id: i,
       text: typeof q === 'string' ? q : q.text || '',
     }))
   )
 }

 const parseAnswerKey = (answerKeyData) => {
   let keys = []
   
   if (answerKeyData) {
     try {
       const parsed = JSON.parse(typeof answerKeyData === 'string' ? answerKeyData : JSON.stringify(answerKeyData))
       if (Array.isArray(parsed)) {
         keys = parsed.map((item, i) => {
           return {
             id: item.id !== undefined ? item.id : i,
             text: item.text || String(item) || '',
           }
         })
       }
     } catch (e) {
       console.error('Error parsing answer key:', e)
       keys = []
     }
   }
   
   if (keys.length === 0 && questions.length > 0) {
     keys = questions.map((q, i) => ({
       id: i,
       text: `[Answer Key ${i + 1} - Click to edit]`,
     }))
   }

   const validKeys = keys.filter(k => k && k.text !== null && k.text !== undefined)
   setAnswerKey(validKeys.length > 0 ? validKeys : [{ id: 0, text: '[No answer keys available]' }])
 }


 const handleEdit = (index, text) => {
   setEditingId(index)
   setEditText(text)
 }


 const handleSave = async (index) => {
   setSaving(true)
   try {
     const updated = [...questions]
     updated[index].text = editText
     setQuestions(updated)


     const updatedContent = JSON.stringify(updated.map(q => q.text))
     const { error } = await supabase
       .from('documents')
       .update({ content: updatedContent })
       .eq('id', id)


     if (error) throw error
     setEditingId(null)
     setAlert({ message: 'Question saved successfully!', type: 'success' })
   } catch (error) {
     console.error('Error saving:', error)
     setAlert({ message: 'Failed to save question', type: 'error' })
   } finally {
     setSaving(false)
   }
 }


 const handleCancel = () => {
   setEditingId(null)
   setEditText('')
 }

 const handleSaveTitle = async () => {
   setSaving(true)
   try {
     const { error } = await supabase
       .from('documents')
       .update({ title: titleText })
       .eq('id', id)

     if (error) throw error
     setDocument({ ...document, title: titleText })
     setEditingTitle(false)
     setAlert({ message: 'Title saved successfully!', type: 'success' })
   } catch (error) {
     console.error('Error saving title:', error)
     setAlert({ message: 'Failed to save title', type: 'error' })
   } finally {
     setSaving(false)
   }
 }

 const handleSaveAnswerKey = async (index) => {
   setSaving(true)
   try {
     const updated = [...answerKey]
     updated[index] = {
       id: updated[index].id,
       text: editText,
     }
     setAnswerKey(updated)

     const updatedAnswerKey = JSON.stringify(updated)
     const { error } = await supabase
       .from('documents')
       .update({ answer_key: updatedAnswerKey })
       .eq('id', id)

     if (error) throw error
     setEditingId(null)
     setAlert({ message: 'Answer key saved successfully!', type: 'success' })
   } catch (error) {
     console.error('Error saving answer key:', error)
     setAlert({ message: 'Failed to save answer key', type: 'error' })
   } finally {
     setSaving(false)
   }
 }

 const handleCancelAnswerKey = () => {
   setEditingId(null)
   setEditText('')
 }


 const handleAddQuestion = async () => {
   if (!newQuestionText.trim()) {
     setAlert({ message: 'Question cannot be empty', type: 'error' })
     return
   }


   try {
     const updated = [...questions, { id: questions.length, text: newQuestionText.trim() }]
     setQuestions(updated)


     const updatedContent = JSON.stringify(updated.map(q => q.text))
     const { error } = await supabase
       .from('documents')
       .update({ content: updatedContent })
       .eq('id', id)


     if (error) throw error
     setNewQuestionText('')
     setAddingQuestion(false)
     setAlert({ message: 'Question added successfully!', type: 'success' })
   } catch (error) {
     console.error('Error adding question:', error)
     setAlert({ message: 'Failed to add question', type: 'error' })
   }
 }


 const handleDeleteQuestion = async (index) => {
   if (!window.confirm('Delete this question?')) return


   try {
     const updated = questions.filter((_, i) => i !== index)
     setQuestions(updated)


     const updatedContent = JSON.stringify(updated.map(q => q.text))
     const { error } = await supabase
       .from('documents')
       .update({ content: updatedContent })
       .eq('id', id)


     if (error) throw error
     setAlert({ message: 'Question deleted!', type: 'success' })
   } catch (error) {
     console.error('Error deleting question:', error)
     setAlert({ message: 'Failed to delete question', type: 'error' })
   }
 }

 /**
  * FIXED EXPORT TO PDF
  * Correctly handles the binary stream from pdfkit and triggers a browser download
  */
 const exportToPdf = async (includeAnswerKey = false) => {
   try {
     setAlert({ message: 'Generating PDF...', type: 'info' });

     const qs = questions.length > 0 ? questions.map(q => q.text) : ['[No questions]'];
     const aks = includeAnswerKey && answerKey.length > 0 ? answerKey.map(a => a.text) : [];
     
     const response = await fetch('/api/pdf', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         title: titleText || document.topic,
         grade: document.grade,
         subject: document.subject,
         docType: document.doc_type,
         questions: qs,
         answerKey: aks,
         includeAnswerKey
       })
     });

     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.details || 'Failed to generate PDF');
     }

     // 1. Convert response to Blob (Crucial for PDFkit streams)
     const blob = await response.blob();
     
     // 2. Create a temporary URL for the blob
     const downloadUrl = window.URL.createObjectURL(blob);
     
     // 3. Create and trigger download link
     const a = window.document.createElement('a');
     a.href = downloadUrl;
     
     // Sanitize filename: remove special characters and spaces
     const cleanTitle = (titleText || document.topic).replace(/[^a-z0-9]/gi, '_').toLowerCase();
     const suffix = includeAnswerKey ? 'with_answers' : 'questions';
     a.download = `${cleanTitle}_${suffix}.pdf`;
     
     window.document.body.appendChild(a);
     a.click();
     
     // 4. Cleanup
     a.remove();
     window.URL.revokeObjectURL(downloadUrl);

     setAlert({ message: `PDF exported successfully!`, type: 'success' });
   } catch (error) {
     console.error('Error exporting PDF:', error);
     setAlert({ message: error.message || 'Failed to export PDF', type: 'error' });
   }
 };

 
 /**
  * FIXED DELETE MATERIAL
  * Handles the state during deletion and provides a smooth redirect
  */
 const handleDelete = async () => {
   const confirmMessage = 'Are you sure you want to delete this material? This cannot be undone.';
   if (!window.confirm(confirmMessage)) return;

   setDeleting(true);
   try {
     const { error } = await supabase
       .from('documents')
       .delete()
       .eq('id', id);

     if (error) throw error;

     setAlert({ message: 'Material deleted successfully', type: 'success' });
     
     // Give the user a moment to see the success message
     setTimeout(() => {
       router.push('/materials');
     }, 1200);
     
   } catch (error) {
     console.error('Error deleting:', error);
     setAlert({ message: 'Failed to delete material', type: 'error' });
     setDeleting(false); // Reset button state if deletion fails
   }
 };


 if (loading || !document) {
   return (
     <Layout session={session} loading={appLoading}>
       <div className="flex items-center justify-center min-h-[400px]">
         <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
           <p className="text-slate-600">Loading document...</p>
         </div>
       </div>
     </Layout>
   )
 }


 return (
   <Layout session={session} loading={appLoading}>
     {alert && (
       <Alert
         message={alert.message}
         type={alert.type}
         onClose={() => setAlert(null)}
       />
     )}
     <div className="max-w-4xl mx-auto animate-fade-in-up-1">
       {/* Header */}
       <div className="mb-8">
         <button
           onClick={() => router.back()}
           className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition font-medium"
         >
           <ArrowLeft className="w-5 h-5" />
           Back to Materials
         </button>
        
         {editingTitle ? (
           <div className="mb-4">
             <textarea
               value={titleText}
               onChange={(e) => setTitleText(e.target.value)}
               className="w-full text-3xl font-bold text-slate-900 p-4 border-2 border-indigo-500 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
               rows="2"
               disabled={saving}
             />
             <div className="flex gap-2 mt-3">
               <button
                 onClick={handleSaveTitle}
                 disabled={saving}
                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition font-medium"
               >
                 {saving ? 'Saving...' : 'Save Title'}
               </button>
               <button
                 onClick={() => {
                   setEditingTitle(false)
                   setTitleText(document.title || document.topic)
                 }}
                 disabled={saving}
                 className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:bg-slate-100 transition font-medium"
               >
                 Cancel
               </button>
             </div>
           </div>
         ) : (
           <div className="mb-4 group cursor-pointer flex items-start gap-3">
             <h1 className="text-3xl font-bold text-slate-900">
               {titleText || document.topic}
             </h1>
             <button
               onClick={() => {
                 setEditingTitle(true)
                 setTitleText(titleText || document.topic)
               }}
               className="opacity-0 group-hover:opacity-100 mt-1 p-2 text-slate-400 hover:text-slate-600 transition"
               title="Edit title"
             >
               <Edit2 className="w-5 h-5" />
             </button>
           </div>
         )}
        
         <div className="flex flex-wrap gap-2 mb-6">
           <span className="inline-block px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg">
             {document.doc_type}
           </span>
           <span className="inline-block px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg">
             Grade {document.grade}
           </span>
           <span className="inline-block px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg">
             {document.subject}
           </span>
         </div>
       </div>


      {/* Action Buttons Container */}
<div className="flex flex-wrap items-center justify-between gap-4 mb-10 animate-fade-in-up-2">
  
  {/* The New Component: Consolidates all export logic */}
  <ExportDropdown onExport={exportToPdf} />

  {/* Refined Standalone Delete Button */}
  <button
    onClick={handleDelete}
    disabled={deleting}
    className="group flex items-center gap-2 px-6 py-2.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 font-black uppercase text-[10px] tracking-[0.2em] disabled:opacity-30"
  >
    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
    {deleting ? 'Purging Material...' : 'Delete Permanently'}
  </button>
</div>


       {/* Questions Container */}
       <div className="bg-white border border-slate-200 rounded-xl shadow-sm animate-fade-in-up-3 mb-6">
         <button
           onClick={() => setShowQuestions(!showQuestions)}
           className="w-full flex items-center gap-3 p-6 hover:bg-slate-50 transition rounded-t-xl"
         >
           {showQuestions ? <ChevronUp className="w-6 h-6 text-indigo-600" /> : <ChevronDown className="w-6 h-6 text-indigo-600" />}
           <FileText className="w-6 h-6 text-indigo-600" />
           <h2 className="text-2xl font-bold text-slate-900">Questions</h2>
           <span className="ml-auto text-sm font-medium text-slate-500">{questions.length} {questions.length === 1 ? 'question' : 'questions'}</span>
         </button>
         
         {showQuestions && (
         <>
           <div className="p-6 pt-4 space-y-3 border-t border-slate-200">
             {questions.length === 0 ? (
               <div className="text-center py-12 text-slate-500">
                 No questions found. Add your first question below!
               </div>
             ) : (
               questions.map((question, index) => (
                 <div
                   key={index}
                   className="bg-slate-50 border border-slate-200 rounded-lg p-5 hover:shadow-sm transition group"
                 >
                   <div className="flex items-start gap-4">
                     <div className="flex-shrink-0 w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-sm">
                       {index + 1}
                     </div>

                     <div className="flex-1 min-w-0">
                       {editingId === index ? (
                         <textarea
                           value={editText}
                           onChange={(e) => setEditText(e.target.value)}
                           className="w-full border-2 border-indigo-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white"
                           rows="4"
                           placeholder="Use $ for inline math: $x = 2$ or $$ for display math: $$x = 2$$"
                         />
                       ) : (
                         <div className="text-slate-900">
                           <MathDisplay content={question.text} />
                         </div>
                       )}
                     </div>

                     {editingId === index ? (
                       <div className="flex gap-2 flex-shrink-0">
                         <button
                           onClick={() => handleSave(index)}
                           disabled={saving}
                           className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition disabled:opacity-50"
                         >
                           <Save className="w-5 h-5" />
                         </button>
                         <button
                           onClick={handleCancel}
                           className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                         >
                           <X className="w-5 h-5" />
                         </button>
                       </div>
                     ) : (
                       <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                         <button
                           onClick={() => handleEdit(index, question.text)}
                           className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                         >
                           <Edit2 className="w-5 h-5" />
                         </button>
                         <button
                           onClick={() => handleDeleteQuestion(index)}
                           className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                       </div>
                     )}
                   </div>
                 </div>
               ))
             )}
           </div>

           {/* Add Question Section */}
           <div className="p-6 pt-4 border-t border-slate-200">
             {!addingQuestion ? (
               <button
                 onClick={() => setAddingQuestion(true)}
                 className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
               >
                 <Plus className="w-5 h-5" />
                 Add Question
               </button>
             ) : (
               <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-5 space-y-3">
                 <div>
                   <label className="block text-sm font-semibold text-slate-900 mb-1">New Question</label>
                   <p className="text-xs text-slate-600">💡 Use $x = 2$ for inline math, or $$\frac{1}{2}$$ for display math</p>
                 </div>
                 <textarea
                   value={newQuestionText}
                   onChange={(e) => setNewQuestionText(e.target.value)}
                   placeholder="Enter your question here... Example: Solve $2x + 3 = 7$"
                   className="w-full border-2 border-indigo-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white"
                   rows="3"
                 />
                 <div className="flex gap-2">
                   <button
                     onClick={handleAddQuestion}
                     className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                   >
                     <Save className="w-4 h-4" />
                     Add Question
                   </button>
                   <button
                     onClick={() => {
                       setAddingQuestion(false)
                       setNewQuestionText('')
                     }}
                     className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             )}
           </div>
         </>
         )}
       </div>

       {/* Answer Key Container */}
       <div className="bg-white border border-slate-200 rounded-xl shadow-sm animate-fade-in-up-4">
         <button
           onClick={() => setShowAnswerKey(!showAnswerKey)}
           className="w-full flex items-center gap-3 p-6 hover:bg-slate-50 transition rounded-t-xl"
         >
           {showAnswerKey ? <ChevronUp className="w-6 h-6 text-emerald-600" /> : <ChevronDown className="w-6 h-6 text-emerald-600" />}
           <FileText className="w-6 h-6 text-emerald-600" />
           <h2 className="text-2xl font-bold text-slate-900">Answer Key</h2>
           <span className="ml-auto text-sm font-medium text-slate-500">{answerKey.length} {answerKey.length === 1 ? 'answer' : 'answers'}</span>
         </button>
         
         {showAnswerKey && (
         <div className="p-6 pt-4 space-y-3 border-t border-slate-200">
           {answerKey && answerKey.length > 0 ? (
             answerKey.map((answer, index) => (
               <div
                 key={index}
                 className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 hover:shadow-sm transition group"
               >
                 <div className="flex items-start gap-4">
                   <div className="flex-shrink-0 w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-semibold text-sm">
                     {index + 1}
                   </div>

                   <div className="flex-1 min-w-0">
                     {editingId === `answer-${index}` ? (
                       <textarea
                         value={editText}
                         onChange={(e) => setEditText(e.target.value)}
                         className="w-full border-2 border-emerald-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
                         rows="4"
                         placeholder="Enter answer..."
                       />
                     ) : (
                       <div className="text-slate-900">
                         {answer?.text ? <MathDisplay content={answer.text} /> : <span className="text-slate-500 italic">[No answer provided]</span>}
                       </div>
                     )}
                   </div>

                   {editingId === `answer-${index}` ? (
                     <div className="flex gap-2 flex-shrink-0">
                       <button
                         onClick={() => handleSaveAnswerKey(index)}
                         disabled={saving}
                         className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition disabled:opacity-50"
                       >
                         <Save className="w-5 h-5" />
                       </button>
                       <button
                         onClick={handleCancelAnswerKey}
                         className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                       >
                         <X className="w-5 h-5" />
                       </button>
                     </div>
                   ) : (
                     <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                       <button
                         onClick={() => {
                           setEditingId(`answer-${index}`)
                           setEditText(answer.text)
                         }}
                         className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition"
                       >
                         <Edit2 className="w-5 h-5" />
                       </button>
                     </div>
                   )}
                 </div>
               </div>
             ))
           ) : (
             <div className="text-center py-12 text-slate-500">
               No answer key available. Edit the answer items above to add answers.
             </div>
           )}
         </div>
         )}
       </div>
     </div>
   </Layout>
 )
}