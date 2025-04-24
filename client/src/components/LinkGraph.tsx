import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Zettel } from '../types/zettel';

interface LinkGraphProps {
  zettels: Zettel[];
  onNodeClick?: (zettelId: string) => void;
}

export default function LinkGraph({ zettels, onNodeClick }: LinkGraphProps) {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstance = useRef<Network | null>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    // Создаем узлы и ребра для графа
    const nodes = new DataSet(
      zettels.map(zettel => ({
        id: zettel.id,
        label: zettel.title,
        title: zettel.title, // всплывающая подсказка
        color: {
          background: '#E5E7EB',
          border: '#9CA3AF',
          highlight: {
            background: '#D1D5DB',
            border: '#6B7280'
          }
        }
      }))
    );

    const edges = new DataSet(
      zettels.flatMap(zettel => 
        zettel.links?.map(linkId => ({
          from: zettel.id,
          to: linkId,
          arrows: 'to',
          smooth: {
            type: 'curvedCW',
            roundness: 0.2
          }
        })) || []
      )
    );

    // Настройки графа
    const options = {
      nodes: {
        shape: 'dot',
        size: 16,
        font: {
          size: 12,
          color: '#374151'
        }
      },
      edges: {
        width: 1,
        color: {
          color: '#9CA3AF',
          highlight: '#6B7280'
        }
      },
      physics: {
        stabilization: {
          iterations: 100
        },
        barnesHut: {
          gravitationalConstant: -2000,
          springLength: 200
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200
      }
    };

    // Создаем экземпляр сети
    networkInstance.current = new Network(
      networkRef.current,
      { nodes, edges },
      options
    );

    // Обработчик клика по узлу
    if (onNodeClick) {
      networkInstance.current.on('click', (params) => {
        if (params.nodes.length > 0) {
          onNodeClick(params.nodes[0]);
        }
      });
    }

    // Очистка при размонтировании
    return () => {
      if (networkInstance.current) {
        networkInstance.current.destroy();
      }
    };
  }, [zettels, onNodeClick]);

  return (
    <div className="w-full h-[600px] bg-white rounded-lg shadow-sm">
      <div ref={networkRef} className="w-full h-full" />
    </div>
  );
} 