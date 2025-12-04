import React, { useEffect, useState, useCallback } from "react";
import { Modal, Form, Input, Select, InputNumber, Button, Typography, message } from "antd";
import axios from "axios";
import { teacherService } from "../services/TeacherService";

const { Title, Text } = Typography;

function GenerateQuizModal({ visible, onClose, onGenerated }) {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const fetchCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/courses`);
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Impossible de charger les cours");
    } finally {
      setLoadingCourses(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    if (visible) {
      fetchCourses();
    }
  }, [visible, fetchCourses]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload = {
        courseId: values.courseId,
        title: values.title,
        description: values.description,
        numberOfQuestions: values.numberOfQuestions,
      };

      const result = await teacherService.generateQuiz(payload);
      message.success("Quiz généré et enregistré");

      if (onGenerated) onGenerated(result.quiz);
      onClose();
    } catch (err) {
      if (err?.errorFields) return; // erreurs de validation
      console.error(err);
      message.error("Échec de la génération du quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Title level={4} style={{ margin: 0 }}>
            Générer un quiz
          </Title>
          <Text type="secondary">à partir d'un cours uploadé</Text>
        </div>
      }
      okText="Générer"
      onOk={handleSubmit}
      confirmLoading={submitting}
      width={700}
    >
      <Form form={form} layout="vertical" initialValues={{ numberOfQuestions: 10 }}>
        <Form.Item
          label="Cours"
          name="courseId"
          rules={[{ required: true, message: "Veuillez sélectionner un cours" }]}
        >
          <Select
            placeholder="Sélectionner un cours"
            loading={loadingCourses}
            options={courses.map((c) => ({ value: c._id, label: c.name }))}
            showSearch
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          />
        </Form.Item>

        <Form.Item
          label="Titre du quiz"
          name="title"
          rules={[{ required: true, message: "Veuillez saisir un titre" }]}
        >
          <Input placeholder="Ex: Quiz - Chapitre 1" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Veuillez saisir une description" }]}
        >
          <Input.TextArea rows={4} placeholder="Consignes, notions évaluées, etc." />
        </Form.Item>

        <Form.Item label="Nombre de questions" name="numberOfQuestions">
          <InputNumber min={1} max={50} style={{ width: 120 }} />
        </Form.Item>

        <Text type="secondary">
          Le quiz sera créé avec statut non publié. Vous pourrez valider/rejeter les questions.
        </Text>
      </Form>
    </Modal>
  );
}

export default GenerateQuizModal;
