import { useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { PageWrapper } from '@/components/common/wrapper/PageWrapper';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { useToastStore } from '@/store/toastStore';
import apiClient from '@/api/client';
import type { Notice } from '@/types/notice';
import type { ApiResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

const schema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(100, '제목은 100자 이하로 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  isPublished: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export function NoticeEditPage() {
  const params = useParams({ strict: false });
  const noticeId = (params as Record<string, string>).noticeId;
  const isEdit = !!noticeId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data: existing } = useQuery({
    queryKey: ['notice', noticeId],
    queryFn: () =>
      apiClient.get<ApiResponse<Notice>>(`/notices/${noticeId}`).then((r) => r.data.data),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', content: '', isPublished: true },
  });

  useEffect(() => {
    if (existing) reset({ title: existing.title, content: existing.content, isPublished: existing.isPublished });
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit
        ? apiClient.put<ApiResponse<Notice>>(`/notices/${noticeId}`, values)
        : apiClient.post<ApiResponse<Notice>>('/notices', values),
    onSuccess: (res) => {
      addToast('success', isEdit ? '수정되었습니다.' : '공지사항이 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ['notice', noticeId] });
      navigate({ to: `${ROUTES.ADMIN_NOTICES}/${res.data.data.id}` });
    },
    onError: () => addToast('error', '저장 중 오류가 발생했습니다.'),
  });

  return (
    <PageWrapper
      title={isEdit ? '공지사항 수정' : '공지사항 등록'}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: isEdit ? `${ROUTES.ADMIN_NOTICES}/${noticeId}` : ROUTES.ADMIN_NOTICES })}
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
              제목 <span className="text-red-500">*</span>
            </label>
            <Input placeholder="공지사항 제목을 입력하세요." error={errors.title?.message} {...register('title')} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              내용 <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={12}
              placeholder="공지사항 내용을 입력하세요."
              error={errors.content?.message}
              {...register('content')}
            />
          </div>
          <Checkbox label="즉시 게시" {...register('isPublished')} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? '수정 완료' : '등록'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate({ to: isEdit ? `${ROUTES.ADMIN_NOTICES}/${noticeId}` : ROUTES.ADMIN_NOTICES })}
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
