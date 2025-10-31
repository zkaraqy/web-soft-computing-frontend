/**
 * Assignments/Tugas Page
 */

"use client";

import Image from "next/image";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useState } from "react";

interface Assignment {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

interface Question {
  question: string;
  answer: React.ReactNode;
  image?: {
    src: string;
    alt: string;
    caption: string;
  };
}

const assignments: Assignment[] = [
  {
    id: 1,
    title: "Tugas 1: Pengenalan Soft Computing",
    description:
      "Memahami konsep dasar soft computing, fuzzy logic, dan neural networks",
    questions: [
      {
        question: "Apa itu Soft Computing?",
        answer: (
          <div className="text-justify">
            <p className="mb-4">
              Soft Computing adalah kumpulan teknik perhitungan dalam ilmu
              komputer, inteligensia semu, machine learning dan beberapa
              disiplin ilmu teknik lainnya, yang berusaha untuk mempelajari,
              memodelkan, dan menganalisa fenomena yang sangat rumit.
            </p>
            <p className="mb-4">
              Soft Computing merupakan inovasi dalam membangun sistem cerdas
              yang mampu beradaptasi dan belajar. Konsep ini mengeksploitasi
              toleransi terhadap ketidakpastian dan ketidaktepatan.
              Metodologinya meliputi Sistem Fuzzy, Jaringan Syaraf,
              Probabilistic Reasoning, dan Evolutionary Computing (algoritma
              genetika).
            </p>
          </div>
        ),
        image: {
          src: "https://media.geeksforgeeks.org/wp-content/uploads/20200319093255/soft.png",
          alt: "Soft Computing Diagram",
          caption: "www.geeksforgeeks.org",
        },
      },
      {
        question: "Apa itu Logika Fuzzy?",
        answer: (
          <div className="text-justify">
            <p className="mb-4">
              Logika fuzzy adalah suatu cara yang tepat untuk memetakan suatu
              ruang input ke dalam suatu ruang output. Logika Fuzzy adalah
              peningkatan dari logika Boolean yang mengenalkan konsep kebenaran
              sebagian.
            </p>
            <p className="mb-4">
              Di mana logika klasik menyatakan bahwa segala hal dapat
              diekspresikan dalam istilah binary (0 atau 1, hitam atau putih, ya
              atau tidak), logika fuzzy menggantikan kebenaran boolean dengan
              tingkat kebenaran. Logika Fuzzy memungkinkan nilai keanggotaan
              antara 0 dan 1, tingkat keabuan dan juga hitam dan putih, dan
              dalam bentuk linguistik, konsep tidak pasti seperti 'sedikit',
              'lumayan', dan 'sangat'.
            </p>
          </div>
        ),
        image: {
          src: "https://cdn.ttgtmedia.com/rms/onlineimages/enterprise_ai-fuzzy_logic_vs_boolean-f.png",
          alt: "Fuzzy Logic vs Boolean",
          caption: "techtarget.com",
        },
      },
      {
        question: "Apa itu Neural Network (NN)?",
        answer: (
          <div className="text-justify">
            <p className="mb-4">
              Neural network atau jaringan saraf tiruan adalah model matematis
              yang terinspirasi dari cara kerja otak manusia. Neural network
              dirancang untuk meniru cara otak manusia memproses informasi,
              menggunakan unit-unit sederhana yang disebut neuron.
            </p>
            <p className="mb-4">
              Jaringan saraf ini terdiri dari tiga tipe utama lapisan: input
              layer (lapisan input), hidden layer (lapisan tersembunyi), dan
              output layer (lapisan output). Input layer menerima data awal,
              hidden layer memproses data tersebut melalui berbagai neuron, dan
              output layer menghasilkan hasil akhir berdasarkan pemrosesan yang
              dilakukan oleh lapisan-lapisan sebelumnya.
            </p>
            <p>
              Setiap neuron dalam jaringan saraf ini berfungsi untuk menghitung
              nilai berdasarkan bobot yang diberikan dan kemudian meneruskan
              hasilnya ke neuron lain dalam jaringan.
            </p>
          </div>
        ),
        image: {
          src: "https://www.ibm.com/content/dam/connectedassets-adobe-cms/worldwide-content/cdp/cf/ul/g/3a/b8/ICLH_Diagram_Batch_01_03-DeepNeuralNetwork.png",
          alt: "Deep Neural Network",
          caption: "ibm.com",
        },
      },
    ],
  },
];

export default function AssignmentsPage() {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  return (
    <div className="min-h-screen pt-24 w-full bg-gray-50 p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        {/* <div className="mb-8">
          <Badge variant="info" className="mb-4">
            📝 Tugas Matakuliah
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Daftar Tugas Soft Computing
          </h1>
          <p className="text-gray-600 text-lg">
            Kumpulan tugas dan penjelasan materi soft computing
          </p>
        </div> */}

        {/* Assignments List */}
        <div className="space-y-8">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="overflow-hidden">
              {/* Assignment Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {assignment.title}
                  </h2>
                  <Badge variant="success">Completed</Badge>
                </div>
                <p className="text-gray-600">{assignment.description}</p>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {assignment.questions.map((q, idx) => {
                  const questionId = `${assignment.id}-${idx}`;
                  const isExpanded = expandedQuestion === questionId;

                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                    >
                      {/* Question Header */}
                      <button
                        onClick={() => toggleQuestion(questionId)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-indigo-600">
                            {idx + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900 text-left">
                            {q.question}
                          </h3>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Answer Content */}
                      {isExpanded && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                          <div
                            className={
                              q.image ? "grid md:grid-cols-2 gap-6" : ""
                            }
                          >
                            <div className="text-gray-700">{q.answer}</div>

                            {q.image && (
                              <div className="flex justify-center items-start">
                                <div className="bg-white border-gray-200 rounded-lg p-4 shadow-sm">
                                  <div className="relative max-w-md">
                                    <Image
                                      src={q.image.src}
                                      alt={q.image.alt}
                                      width={400}
                                      height={400}
                                      //   fill
                                      className="object-contain rounded"
                                    />
                                  </div>
                                  <p className="text-sm text-gray-500 italic text-center mt-2">
                                    {q.image.caption}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Add Assignment Placeholder */}
        {/* <Card className="mt-8 border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">➕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tambah Tugas Baru
            </h3>
            <p className="text-gray-500">
              Tugas berikutnya akan ditambahkan di sini
            </p>
          </div>
        </Card> */}
      </div>
    </div>
  );
}
