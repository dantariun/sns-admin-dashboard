import { useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { PageWrapper } from '@/components/common/wrapper/PageWrapper';
import { Button } from '@/components/ui/Button/Button';
import { Select } from '@/components/ui/Select/Select';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { useToastStore } from '@/store/toastStore';
import apiClient from '@/api/client';
import type { Faq } from '@/types/notice';
import type { ApiResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

const schema = z.object({
  category: z.enum(['ACCOUNT', 'FEED', 'REPORT', 'ETC'], { required_error: '카테고리를 선택해주세요.' }),
  question: z.string().min(1, '질문을 입력해주세요.').max(200, '질문은 200자 이하로 입력해주세요.'),
  answer: z.string().min(1, '답변을 입력해주세요.'),
});
type FormValues = z.infer<typeof schema>;

const CATEGORY_OPTIONS = [
  { label: '카테고리 선택', value: '' },
  { label: '계정', value: 'ACCOUNT' },
  { label: '피드', value: 'FEED' },
  { label: '신고', value: 'REPORT' },
  { label: '기타', value: 'ETC' },
];

export function FaqEditPage() {
  const params = useParams({ strict: false });
  const faqId = (params as Record<string, string>).faqId;
  const isEdit = !!faqId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data: existing } = useQuery({
    queryKey: ['faq', faqId],
    queryFn: () =>
      apiClient.get<ApiResponse<Faq>>(`/faqs/${faqId}`).then((r) => r.data.data),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'ACCOUNT', question: '', answer: '' },
  });

  useEffect(() => {
    if (existing) reset({ category: existing.category, question: existing.question, answer: existing.answer });
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit
        ? apiClient.put<ApiResponse<Faq>>(`/faqs/${faqId}`, values)
        : apiClient.post<ApiResponse<Faq>>('/faqs', values),
    onSuccess: (res) => {
      addToast('success', isEdit ? '수정되었습니다.' : 'FAQ가 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ['faq', faqId] });
      navigate({ to: `${ROUTES.ADMIN_FAQ}/${res.data.data.id}` });
    },
    onError: () => addToast('error', '저장 중 오류가 발생했습니다.'),
  });

  return (
    <PageWrapper
      title={isEdit ? 'FAQ 수정' : 'FAQ 등록'}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: isEdit ? `${ROUTES.ADMIN_FAQ}/${faqId}` : ROUTES.ADMIN_FAQ })}
        >
          <ArrowLeft size={14} className="mr-1" />
          {isEdit ? '상세로' : '목록으로'}
        </Button>
      }
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <Select options={CATEGORY_OPTIONS} {...register('category')} />
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              질문 <span className="text-red-500">*</span>
            </label>
            <Input placeholder="질문을 입력하세요." error={errors.question?.message} {...register('question')} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              답변 <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={8}
              placeholder="답변을 입력하세요."
              error={errors.answer?.message}
              {...register('answer')}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? '수정 완료' : '등록'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate({ to: isEdit ? `${ROUTES.ADMIN_FAQ}/${faqId}` : ROUTES.ADMIN_FAQ })}
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
